from flask import Blueprint, request
from app.models import db, RoutePicture, AscentPicture
from app.forms.image_form import ImageForm
from flask_login import current_user, login_required
from .s3_utils import (
    upload_file_to_s3, get_unique_filename)

image_routes = Blueprint("images", __name__)


@image_routes.route("/route", methods=["POST"])
@login_required
def upload_route_image(routeId):
    form = ImageForm()

    if form.validate_on_submit():

        image = form.data["image"]
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)
        print(upload)

        if "url" not in upload:
        # if the dictionary doesn't have a url key
        # it means that there was an error when you tried to upload
        # so you send back that error message (and you printed it above)
            return render_template("post_form.html", form=form, errors=[upload])

        url = upload["url"]
        new_image = RoutePicture( route_id=routeId, picture_url=url, uploaded_by=current_user.id)
        db.session.add(new_image)
        db.session.commit()
        return new_image.to_dict(), 201

    if form.errors:
        print(form.errors)
        return render_template("post_form.html", form=form, errors=form.errors)

    return render_template("post_form.html", form=form, errors=None)



@image_routes.route("/ascent", methods=["POST"])
@login_required
def upload_ascent_image(ascentId):
    form = ImageForm()

    if form.validate_on_submit():

        image = form.data["image"]
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)
        print(upload)

        if "url" not in upload:
        # if the dictionary doesn't have a url key
        # it means that there was an error when you tried to upload
        # so you send back that error message (and you printed it above)
            return render_template("post_form.html", form=form, errors=[upload])

        url = upload["url"]
        new_image = AscentPicture( ascent_id=ascentId, picture_url=url, uploaded_by=current_user.id)
        db.session.add(new_image)
        db.session.commit()
        return new_image.to_dict(), 201

    if form.errors:
        print(form.errors)
        return render_template("post_form.html", form=form, errors=form.errors)

    return render_template("post_form.html", form=form, errors=None)
