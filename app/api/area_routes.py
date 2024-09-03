from flask_login import current_user, login_required
from flask import Blueprint, request
from app.models import db, User, ClimbingArea, AreaPicture
from app.forms import ClimbingAreaForm, ImageForm

area_routes = Blueprint('areas', __name__)

@area_routes.route('/', methods = ['GET'])
def get_all_areas():

    '''
        Get all Areas in the DB

    '''
    areas = [x.to_dict() for x in ClimbingArea.query.all()]
    for area in areas:
        area['images'] = [x.to_dict() for x in AreaPicture.query.filter_by(area_id=area['id']).all()]
    return {"Areas": areas}

@area_routes.route('/<int:id>', methods= ['GET'])
def one_area(id):
    '''
        Get one area in the DB by id
    '''

    area = ClimbingArea.query.filter_by(id=id).first()
    if area == None:
        return {'message': "area could not be found"}, 404
    areaObj = area.to_dict()
    areaObj['images'] = [x.to_dict() for x in AreaPicture.query.filter_by(area_id=areaObj['id']).all()]
    return {'Area':areaObj}


