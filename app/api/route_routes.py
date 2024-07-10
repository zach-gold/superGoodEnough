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
    return {"Route":routeObj}


@route_routes.route('/<int:id>/ascents')
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
def make_ascent(id):

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
