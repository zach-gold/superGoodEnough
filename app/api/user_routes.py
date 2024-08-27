from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, db
from app.forms import UserProfileForm

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
# @login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = [user.to_dict() for user in User.query.all()]
    # print(users)
    return users


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/<int:id>', methods=['PATCH'])
@login_required
def update_user(id):
    user = User.query.get(id)
    if user.id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    form = UserProfileForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        user.username = form.data['username']
        user.email = form.data['email']
        user.first_name = form.data['first_name']
        user.last_name = form.data['last_name']
        user.bio = form.data['bio']
        user.profile_picture_url = form.data['profile_picture_url']
        db.session.commit()
        retUser = user.to_dict()
        return {"User": retUser}
    return jsonify({'errors': form.errors}), 400

@user_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_user(id):
    user = User.query.get(id)
    if user.id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(user)
    db.session.commit()
    return {'message': 'User deleted successfully'}
