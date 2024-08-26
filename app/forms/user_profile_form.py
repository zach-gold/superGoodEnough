from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, URLField
from wtforms.validators import DataRequired, Email, Length, Optional

class UserProfileForm(FlaskForm):
    username = StringField('username', validators=[DataRequired(), Length(max=40)])
    email = StringField('email', validators=[DataRequired(), Email(), Length(max=255)])
    first_name = StringField('first_name', validators=[Optional(), Length(max=25)])
    last_name = StringField('last_name', validators=[Optional(), Length(max=25)])
    bio = TextAreaField('bio', validators=[Optional(), Length(max=2000)])
    profile_picture_url = URLField('profile_picture_url', validators=[Optional(), Length(max=2000)])
