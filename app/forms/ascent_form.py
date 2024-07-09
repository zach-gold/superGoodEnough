from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, IntegerField, DateTimeField
from wtforms.validators import DataRequired, Optional, Length, ValidationError
from app.models import User, Route


def user_exists(form, field):
    # Checking if the user exists
    user_id = field.data
    user = User.query.filter(User.id == user_id).first()
    if not user:
        raise ValidationError('User does not exist.')

def route_exists(form, field):
    # Checking if the route exists
    route_id = field.data
    route = Route.query.filter(Route.id == route_id).first()
    if not route:
        raise ValidationError('Route does not exist.')




class AscentForm(FlaskForm):
    user_id = IntegerField(
        'User ID', validators=[DataRequired(), user_exists])
    route_id = IntegerField(
        'Route ID', validators=[DataRequired(), route_exists])
    date = DateTimeField(
        'Date', validators=[DataRequired()], )
    style = StringField(
        'Style', validators=[Optional(), Length(max=25)])
    notes = TextAreaField(
        'Notes', validators=[Optional(), Length(max=2000)])
