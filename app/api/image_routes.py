from flask import Blueprint, request
from app.models import db, RoutePicture, AscentPicture
from app.forms.image_form import ImageForm
from flask_login import current_user, login_required
from .s3_utils import upload_file_to_s3, get_unique_filename

# Create a Blueprint for image routes
image_routes = Blueprint("images", __name__)


@image_routes.route("/route/<int:routeId>", methods=["POST"])
@login_required
def upload_route_image(routeId):
    form = ImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    print(form.errors)  # Print form errors for debugging

    # Validate the form submission
    if form.validate_on_submit():

        # Process the image file
        image = form.data["image"]
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)
        print(upload)  # Print upload result for debugging

        # Check if the upload was successful
        if "url" not in upload:
            # If the dictionary doesn't have a url key, there was an error
            return {'errors': upload['errors']}, 400

        # Save the image URL in the database
        url = upload["url"]
        new_image = RoutePicture(route_id=routeId, picture_url=url, uploaded_by=current_user.id)
        db.session.add(new_image)
        db.session.commit()
        return new_image.to_dict(), 201

    # Handle form validation errors
    if form.errors:
        print(form.errors)  # Print form errors for debugging
        print("huzzah")
        return {'errors': form.errors}, 400


@image_routes.route("/ascent/<int:ascentId>", methods=["POST"])
@login_required
def upload_ascent_image(ascentId):
    form = ImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    # Validate the form submission
    if form.validate_on_submit():

        # Process the image file
        image = form.data["image"]
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)
        print(upload)  # Print upload result for debugging

        # Check if the upload was successful
        if "url" not in upload:
            # If the dictionary doesn't have a url key, there was an error
            return {'errors': upload['errors']}, 400

        # Save the image URL in the database
        url = upload["url"]
        new_image = AscentPicture(ascent_id=ascentId, picture_url=url, uploaded_by=current_user.id)
        db.session.add(new_image)
        db.session.commit()
        return new_image.to_dict(), 201

    # Handle form validation errors
    if form.errors:
        print(form.errors)  # Print form errors for debugging
        return {'errors': form.errors}, 400
