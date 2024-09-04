from app.models import ClimbingArea
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, IntegerField
from wtforms.validators import DataRequired, Optional, Length, NumberRange, ValidationError


def parent_exists(form, field):
    # Checking if the route exists
    parent_id = field.data
    parent = ClimbingArea.query.filter(ClimbingArea.id == parent_id).first()
    if not parent:
        raise ValidationError('Parent does not exist.')

class ClimbingAreaForm(FlaskForm):
    name = StringField(
        'Name',
        validators=[
            DataRequired(message="Name is required."),
            Length(max=255, message="Name cannot exceed 255 characters.")
        ]
    )

    parent_id = IntegerField(
        'Parent ID',
        validators=[
            Optional(),
            NumberRange(min=1, message="Parent ID must be a positive integer."),
            parent_exists
        ]
    )

    description = TextAreaField(
        'Description',
        validators=[
            Optional(),
            Length(max=2000, message="Description cannot exceed 2000 characters.")
        ]
    )
