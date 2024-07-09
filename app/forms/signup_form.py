from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


class SignUpForm(FlaskForm):
    username = StringField(
        'Username', validators=[DataRequired(), Length(min=4, max=40), username_exists])
    email = StringField(
        'Email', validators=[DataRequired(), Length(max=255), user_exists])
    password = StringField(
        'Password', validators=[DataRequired(), Length(min=8)])
    first_name = StringField(
        'First Name', validators=[Length(max=25)])
    last_name = StringField(
        'Last Name', validators=[Length(max=25)])
    bio = TextAreaField(
        'Bio', validators=[Length(max=2000)])
