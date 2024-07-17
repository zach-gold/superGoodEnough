from flask_login import current_user, login_required
from flask import Blueprint, request
from app.models import Route, Ascent, db, User, RoutePicture, AscentPicture
from app.forms import RouteForm, AscentForm, ImageForm

# Create a Blueprint for route routes
route_routes = Blueprint('routes', __name__)

@route_routes.route('/', methods=['GET'])
def get_all_routes():
    '''
        Get all routes in the DB
    '''
    # Retrieve all routes and convert them to dictionaries
    routes = [x.to_dict() for x in Route.query.all()]

    # For each route, retrieve and include related images, author, and ascents
    for route in routes:
        route['images'] = [x.to_dict() for x in RoutePicture.query.filter_by(route_id=route['id']).all()]
        author = User.query.filter_by(id=route['created_by']).first()
        route['author'] = author.username
        route['ascents'] = [x.to_dict() for x in Ascent.query.filter_by(route_id=route['id']).all()]

        # For each ascent, retrieve and include related author and images
        for ascent in route['ascents']:
            user = User.query.filter_by(id=ascent['user_id']).first()
            ascent['author'] = user.to_dict()
            ascent['images'] = [x.to_dict() for x in AscentPicture.query.filter_by(ascent_id=ascent['id']).all()]

    # Return the routes with additional data
    return {"Routes": routes}

@route_routes.route('/<int:id>', methods=['GET'])
def one_route(id):
    '''
        Get one route in the database by the id
    '''
    # Retrieve the route by id
    route = Route.query.filter_by(id=id).first()
    if route is None:
        return {'message': "Route couldn't be found"}, 404

    # Convert the route to a dictionary and include related images, author, and ascents
    routeObj = route.to_dict()
    routeObj['images'] = [x.to_dict() for x in RoutePicture.query.filter_by(route_id=routeObj['id']).all()]
    author = User.query.filter_by(id=routeObj['created_by']).first()
    routeObj['author'] = author.username
    routeObj['ascents'] = [x.to_dict() for x in Ascent.query.filter_by(route_id=routeObj['id']).all()]

    # For each ascent, retrieve and include related author and images
    for ascent in routeObj['ascents']:
        user = User.query.filter_by(id=ascent['user_id']).first()
        ascent['author'] = user.to_dict()
        ascent['images'] = [x.to_dict() for x in AscentPicture.query.filter_by(ascent_id=ascent['id']).all()]

    # Return the route with additional data
    return {"Route": routeObj}

@route_routes.route('/', methods=['POST'])
@login_required
def create_route():
    '''
        If logged in and the data is valid,
        create a new route and add it to the database
    '''
    form = RouteForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    # Validate the form submission
    if form.validate_on_submit():
        new_route = Route(
            name=form.data['name'],
            grade=form.data['grade'],
            location=form.data['location'],
            area_id=form.data['area_id'],
            description=form.data['description'],
            created_by=current_user.id
        )

        # Add the new route to the database
        db.session.add(new_route)
        db.session.commit()

        # Convert the route to a dictionary and include related author
        safe_route = new_route.to_dict()
        author = User.query.filter_by(id=safe_route['created_by']).first()
        safe_route['author'] = author.username

        # Return the new route with additional data
        return {'Route': safe_route}

    # Handle form validation errors
    if form.errors:
        print(form.errors)  # Print form errors for debugging
        return {"message": "BadRequest", "errors": form.errors}, 400

@route_routes.route('/<int:id>', methods=['PATCH'])
@login_required
def edit_route(id):
    '''
        If logged in and the data is valid,
        update a route and add it to the database
    '''
    # Retrieve the route to be edited
    route = Route.query.filter_by(id=id).first()
    if route.created_by != current_user.id:
        return {"message": "Not the owner of this route"}, 401

    form = RouteForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    # Validate the form submission
    if form.validate_on_submit():
        if form.data['name']:
            route.name = form.data['name']
        if form.data['grade']:
            route.grade = form.data['grade']
        if form.data['location']:
            route.location = form.data['location']
        if form.data['area_id']:
            route.area_id = form.data['area_id']
        if form.data['description']:
            route.description = form.data['description']

        # Commit the changes to the database
        db.session.commit()

        # Convert the route to a dictionary and include related images, author, and ascents
        safe_route = route.to_dict()
        safe_route['images'] = [x.to_dict() for x in RoutePicture.query.filter_by(route_id=safe_route['id']).all()]
        author = User.query.filter_by(id=safe_route['created_by']).first()
        safe_route['author'] = author.username
        safe_route['ascents'] = [x.to_dict() for x in Ascent.query.filter_by(route_id=safe_route['id']).all()]

        # For each ascent, retrieve and include related author and images
        for ascent in safe_route['ascents']:
            user = User.query.filter_by(id=ascent['user_id']).first()
            ascent['author'] = user.to_dict()

        # Return the updated route with additional data
        return {'Route': safe_route}

    # Handle form validation errors
    if form.errors:
        print(form.errors)  # Print form errors for debugging
        return {"message": "BadRequest", "errors": form.errors}, 400

@route_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_post(id):
    '''
        If logged in and the owner of the
        question, delete the route from the
        database if it exists
    '''
    # Retrieve the route to be deleted
    route = Route.query.filter_by(id=id).first()

    # Check if the current user is the owner of the route
    if current_user.id == route.created_by:
        db.session.delete(route)
        db.session.commit()
        return {"id": id}
    else:
        return {"id": None}, 404

@route_routes.route('/<int:id>/ascents', methods=['GET'])
def all_route_ascents(id):
    '''
        Get all ascents for a route in the database
    '''
    # Retrieve all ascents for the specified route and convert them to dictionaries
    ascents = [x.to_dict() for x in Ascent.query.filter_by(route_id=id).all()]

    # For each ascent, retrieve and include related images and author
    for ascent in ascents:
        ascent['images'] = [x.to_dict() for x in AscentPicture.query.filter_by(ascent_id=ascent['id']).all()]
        author = User.query.filter_by(id=ascent['user_id']).first()
        ascent['author'] = author.username

    # Return the ascents with additional data
    return {"Ascents": ascents}

@route_routes.route('/<int:id>/ascents', methods=["POST"])
@login_required
def create_ascent(id):
    '''
        If logged in and the data is valid,
        create a new ascent on a route and add it to the database
    '''
    form = AscentForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    # Validate the form submission
    if form.validate_on_submit():
        new_ascent = Ascent(
            user_id=current_user.id,
            route_id=id,
            date=form.data['date'],
            style=form.data['style'],
            notes=form.data['notes']
        )

        # Add the new ascent to the database
        db.session.add(new_ascent)
        db.session.commit()

        # Convert the ascent to a dictionary and include related route, owner, and images
        safe_ascent = new_ascent.to_dict()
        x_route = Route.query.filter_by(id=id).first()
        route = x_route.to_dict()
        owner = User.query.filter_by(id=route['created_by']).first()
        route['owner'] = owner.to_dict()
        safe_ascent['parent_route'] = route
        safe_ascent['images'] = [x.to_dict() for x in AscentPicture.query.filter_by(ascent_id=safe_ascent['id']).all()]

        # Return the new ascent with additional data
        return {'Ascent': safe_ascent}

    # Handle form validation errors
    if form.errors:
        print(form.errors)  # Print form errors for debugging
        return {"message": "BadRequest", "errors": form.errors}, 400
