from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, IntegerField
from wtforms.validators import DataRequired, Length, Optional, ValidationError
from app.models import ClimbingArea, User


def area_exists(form, field):
    # Checking if the area exists
    area_id = field.data
    area = ClimbingArea.query.filter(ClimbingArea.id == area_id).first()
    if not area:
        raise ValidationError('Climbing area does not exist.')

def user_exists(form, field):
    # Checking if the user exists
    user_id = field.data
    user = User.query.filter(User.id == user_id).first()
    if not user:
        raise ValidationError('User does not exist.')


class RouteForm(FlaskForm):
    name = StringField(
        'Name', validators=[DataRequired(), Length(max=255)])
    grade = StringField(
        'Grade', validators=[Optional(), Length(max=10)])
    location = StringField(
        'Location', validators=[Optional(), Length(max=255)])
    area_id = IntegerField(
        'Area ID', validators=[Optional(), area_exists])
    description = TextAreaField(
        'Description', validators=[Optional(), Length(max=2000)])
    created_by = IntegerField(
        'Created By', validators=[DataRequired(), user_exists])
