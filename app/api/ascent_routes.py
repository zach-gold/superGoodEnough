from flask_login import current_user, login_required
from flask import Blueprint, request
from app.models import db, Ascent, Route, User, AscentPicture
from app.forms import UpdateAscentForm

# Create a Blueprint for ascent routes
ascent_routes = Blueprint('ascents', __name__)


@ascent_routes.route('/', methods=['GET'])
def get_all_ascents():
    '''
        Get all ascents in the database
    '''
    # Retrieve all ascents and convert them to dictionaries
    ascents = [ascent.to_dict() for ascent in Ascent.query.all()]

    # For each ascent, retrieve and include related route and owner information
    for ascent in ascents:
        x_route = Route.query.filter_by(id=ascent['route_id']).first()
        route = x_route.to_dict()
        owner = User.query.filter_by(id=route['created_by']).first()
        route['owner'] = owner.to_dict()
        ascent['parent_route'] = route

        # Retrieve and include ascent pictures
        ascent['images'] = [x.to_dict() for x in AscentPicture.query.filter_by(ascent_id=ascent['id']).all()]

    # Return the ascents with additional data
    return {'Ascents': ascents}

@ascent_routes.route('/<int:id>', methods=['PATCH'])
@login_required
def edit_ascent(id):
    '''
        If logged in and the owner of the ascent,
        update the body of the ascent and
        update the entry in the database
    '''
    # Retrieve the ascent to be edited
    ascent = Ascent.query.filter_by(id=id).first()

    # Check if the current user is the owner of the ascent
    if ascent.user_id != current_user.id:
        return {"message": "Not the owner of this Ascent"}, 401

    form = UpdateAscentForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    # Validate the form submission
    if form.validate_on_submit():
        if form.data['style']:
            ascent.style = form.data['style']
        if form.data['notes']:
            ascent.notes = form.data['notes']

        # Commit the changes to the database
        db.session.commit()

        # Retrieve updated ascent data with related route and owner information
        safe_ascent = ascent.to_dict()
        x_route = Route.query.filter_by(id=ascent.route_id).first()
        route = x_route.to_dict()
        owner = User.query.filter_by(id=route['created_by']).first()
        route['owner'] = owner.to_dict()
        safe_ascent['parent_route'] = route

        # Retrieve and include ascent pictures
        safe_ascent['images'] = [x.to_dict() for x in AscentPicture.query.filter_by(ascent_id=safe_ascent['id']).all()]
        return {'Ascent': safe_ascent}

    # Handle form validation errors
    if form.errors:
        return {"message": "Bad Request", "errors": form.errors}, 400


@ascent_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_ascent(id):
    '''
        If the owner of the ascent, delete the ascent
        if it exists
    '''
    # Retrieve the ascent to be deleted
    ascent = Ascent.query.filter_by(id=id).first()

    # Check if the current user is the owner of the ascent
    if current_user.id == ascent.user_id:
        db.session.delete(ascent)
        db.session.commit()
        return {"id": id}
    else:
        return {"id": None}
