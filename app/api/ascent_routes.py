from flask_login import current_user, login_required
from flask import Blueprint, request
from app.models import db, Ascent, Route,User, AscentPicture
from app.forms import AscentForm

ascent_routes = Blueprint('ascents', __name__)


@ascent_routes.route('/', methods=['GET'])
def get_all_ascents():
    '''
        Get all ascents in the database
    '''
    ascents = [ascent.to_dict() for ascent in Ascent.query.all()]

    for ascent in ascents:
        x_route = Route.query.filter_by(id=ascent['route_id']).first()
        route = x_route.to_dict()
        owner = User.query.filter_by(id=route['created_by']).first()
        route['owner'] = owner.to_dict()
        ascent['parent_route'] = route
        ascent['images'] = [x.to_dict() for x in AscentPicture.query.filter_by(ascent_id=ascent['id']).all()]

    return {'Ascents': ascents}

@ascent_routes.route('/<int:id>', methods=['PATCH'])
@login_required
def edit_ascent(id):
    '''
        If logged in and the owner of the ascent,
        update the body of the ascent and
        update the entry in the database
    '''
    ascent = Ascent.query.filter_by(id=id).first()
    if ascent.created_by != current_user.id:
        return {"message": "Not the owner of this Ascent"}, 401

    form = AscentForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        if form.data['date']:
            ascent.date = form.data['date']
        if form.data['style']:
            ascent.style = form.data['style']
        if form.data['notes']:
            ascent.notes = form.data['notes']

        db.session.commit()

        safe_ascent = ascent.to_dict()
        x_route = Route.query.filter_by(id=ascent.route_id).first()
        route = x_route.to_dict()
        owner = User.query.filter_by(id=route['created_by']).first()
        route['owner'] = owner.to_dict()
        safe_ascent['parent_route'] = route
        safe_ascent['images'] = [x.to_dict() for x in AscentPicture.query.filter_by(ascent_id=safe_ascent['id']).all()]
        return {'Ascent': safe_ascent}

    if form.errors:
        return {"message": "Bad Request", "errors": form.errors}, 400


@ascent_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_ascent(id):
    '''
        If the owner of the ascent, delete the ascent
        if it exists
    '''
    ascent = Ascent.query.filter_by(id=id).first()
    if current_user.id == ascent.user_id:
        db.session.delete(ascent)
        db.session.commit()
        return {"id":id}
    else:
        return {"id":None}
