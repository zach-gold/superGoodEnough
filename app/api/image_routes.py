from flask import Blueprint, request
from app.models import db, RoutePicture, AscentPicture, UserPicture
from app.forms.image_form import ImageForm
from flask_login import current_user, login_required
from .s3_utils import upload_file_to_s3, get_unique_filename

image_routes = Blueprint("images", __name__)


@image_routes.route("/route/<int:routeId>", methods=["POST"])
@login_required
def upload_route_image(routeId):
    form = ImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    print(form.errors)

    if form.validate_on_submit():

        image = form.data["image"]
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)
        print(upload)

        if "url" not in upload:
        # if the dictionary doesn't have a url key
        # it means that there was an error when you tried to upload
        # so you send back that error message (and you printed it above)
            return {'errors': upload['errors']}, 400

        url = upload["url"]
        new_image = RoutePicture( route_id=routeId, picture_url=url, uploaded_by=current_user.id)
        db.session.add(new_image)
        db.session.commit()
        return new_image.to_dict(), 201

    if form.errors:
        print(form.errors)
        print("huzzah")
        return {'errors': form.errors}, 400




@image_routes.route("/ascent/<int:ascentId>", methods=["POST"])
@login_required
def upload_ascent_image(ascentId):
    form = ImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():

        image = form.data["image"]
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)
        print(upload)

        if "url" not in upload:
        # if the dictionary doesn't have a url key
        # it means that there was an error when you tried to upload
        # so you send back that error message (and you printed it above)
            return {'errors': upload['errors']}, 400

        url = upload["url"]
        new_image = AscentPicture( ascent_id=ascentId, picture_url=url, uploaded_by=current_user.id)
        db.session.add(new_image)
        db.session.commit()
        return new_image.to_dict(), 201

    if form.errors:
        print(form.errors)
        return {'errors': form.errors}, 400



@image_routes.route("/user/<int:userId>", methods=["POST"])
@login_required
def upload_user_image():
    form = ImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    print(form.errors)

    if form.validate_on_submit():

        image = form.data["image"]
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)
        print(upload)

        if "url" not in upload:
        # if the dictionary doesn't have a url key
        # it means that there was an error when you tried to upload
        # so you send back that error message (and you printed it above)
            return {'errors': upload['errors']}, 400

        url = upload["url"]
        new_image = UserPicture(picture_url=url, uploaded_by=current_user.id)
        db.session.add(new_image)
        db.session.commit()
        return new_image.to_dict(), 201

    if form.errors:
        print(form.errors)
        print("huzzah")
        return {'errors': form.errors}, 400
