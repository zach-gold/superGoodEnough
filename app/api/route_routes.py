from flask_login import current_user, login_required
from flask import Blueprint, request
from app.models import Route, Ascent, db, User, RoutePicture, AscentPicture
from app.forms import RouteForm, AscentForm, ImageForm

route_routes = Blueprint('routes', __name__)

@route_routes.route('/', methods=['GET'])
def get_all_routes():

    '''
        Get all routes in the DB

    '''
    routes = [x.to_dict() for x in Route.query.all()]
    for route in routes:
        route['images'] = [x.to_dict() for x in RoutePicture.query.filter_by(route_id=route['id']).all()]
        author = User.query.filter_by(id= route['created_by']).first()
        route['author'] = author.username
        route['ascents'] = [x.to_dict() for x in Ascent.query.filter_by(route_id=route['id']).all()]
        for ascent in route['ascents']:
            user = User.query.filter_by(id = ascent['user_id']).first()
            ascent['author'] = user.to_dict()
            ascent['images'] = [x.to_dict() for x in AscentPicture.query.filter_by(ascent_id=ascent['id']).all()]
    return {"Routes":routes}


@route_routes.route('/<int:id>', methods=['GET'])
def one_route(id):
    '''
        Get one route in the database by the id
    '''
    route = Route.query.filter_by(id=id).first()
    if route == None:
        return {'message': "Route couldn't be found"}, 404
    routeObj = route.to_dict()
    routeObj['images'] = [x.to_dict() for x in RoutePicture.query.filter_by(route_id=routeObj['id']).all()]
    author = User.query.filter_by(id= routeObj['created_by']).first()
    routeObj['author'] = author.username
    routeObj['ascents'] = [x.to_dict() for x in Ascent.query.filter_by(route_id=routeObj['id']).all()]
    for ascent in routeObj['ascents']:
        user = User.query.filter_by(id = ascent['user_id']).first()
        ascent['author'] = user.to_dict()
        ascent['images'] = [x.to_dict() for x in AscentPicture.query.filter_by(ascent_id=ascent['id']).all()]
    return {"Route":routeObj}

@route_routes.route('/', methods=['POST'])
@login_required
def create_route():

    '''
        If logged in and the data is valid,
        create a new route and add it to the database
    '''
    form = RouteForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_route = Route(
            name=form.data['name'],
            grade=form.data['grade'],
            location=form.data['location'],
            area_id=form.data['area_id'],
            description=form.data['description'],
            created_by=current_user.id
        )

        db.session.add(new_route)
        db.session.commit()

        safe_route = new_route.to_dict()
        # safe_route['images'] = [x.to_dict() for x in RoutePicture.query.filter_by(route_id=safe_route['id']).all()]
        author = User.query.filter_by(id=safe_route['created_by']).first()
        safe_route['author'] = author.username
        # safe_route['ascents'] =[x.to_dict() for x in Ascent.query.filter_by(route_id=safe_route['id']).all()]
        # for ascent in safe_route['ascents']:
        #     user = User.query.filter_by(id = ascent['user_id']).first()
        #     ascent['author'] = user.to_dict()

        return {'Route': safe_route}
    if form.errors:
        print(form.errors)
        return {"message": "BadRequest", "errors": form.errors}, 400

@route_routes.route('/<int:id>', methods=['PATCH'])
@login_required
def edit_route(id):

    '''
        If logged in and the data is valid,
        update a route and add it to the database
    '''

    route = Route.query.filter_by(id=id).first()
    if route.created_by != current_user.id:
        return {"message": "Not the owner of this route"}, 401

    form = RouteForm()
    form['csrf_token'].data = request.cookies['csrf_token']

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

        db.session.commit()

        safe_route = route.to_dict()
        safe_route['images'] = [x.to_dict() for x in RoutePicture.query.filter_by(route_id=safe_route['id']).all()]
        author = User.query.filter_by(id=safe_route['created_by']).first()
        safe_route['author'] = author.username
        safe_route['ascents'] = [x.to_dict() for x in Ascent.query.filter_by(route_id=safe_route['id']).all()]
        for ascent in safe_route['ascents']:
            user = User.query.filter_by(id=ascent['user_id']).first()
            ascent['author'] = user.to_dict()

        return {'Route': safe_route}
    if form.errors:
        print(form.errors)
        return {"message": "BadRequest", "errors": form.errors}, 400


@route_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_post(id):
    '''
        If logged in and the owner of the
        question, delete the route from the
        database if it exists
    '''
    route = Route.query.filter_by(id=id).first()
    if current_user.id == route.created_by:
        db.session.delete(route)
        db.session.commit()
        return {"id":id}
    else:
        return {"id":None}, 404


@route_routes.route('/<int:id>/ascents', methods=['GET'])
def all_route_ascents(id):
    '''
        Get all ascents for a route in the database
    '''

    ascents = [x.to_dict() for x in Ascent.query.filter_by(route_id=id).all()]
    for ascent in ascents:
        ascent['images'] = [x.to_dict() for x in AscentPicture.query.filter_by(ascent_id=ascent['id']).all()]
        author = User.query.filter_by(id=ascent['user_id']).first()
        ascent['author'] = author.username
    return {"Ascents":ascents}

@route_routes.route('/<int:id>/ascents', methods=["POST"])
@login_required
def create_ascent(id):

    '''
        If logged in and the data is valid,
        create a new ascent on a route and add it to the database
    '''

    form = AscentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_ascent = Ascent(
            user_id=current_user.id,
            route_id=id,
            date=form.data['date'],
            style=form.data['style'],
            notes=form.data['notes']
        )
        db.session.add(new_ascent)
        db.session.commit()

        safe_ascent = new_ascent.to_dict()
        x_route = Route.query.filter_by(id=id).first()
        route = x_route.to_dict()
        owner = User.query.filter_by(id= route['created_by']).first()
        route['owner']=owner.to_dict()
        safe_ascent['parent_route']=route
        safe_ascent['images'] = [x.to_dict() for x in AscentPicture.query.filter_by(ascent_id=safe_ascent['id']).all()]
        return{'Ascent':safe_ascent}
    if form.errors:
        print(form.errors)
        return {"message":"BadRequest", "errors":form.errors}, 400
