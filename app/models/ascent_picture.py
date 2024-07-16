from .db import db, environment, SCHEMA, add_prefix_for_prod


class AscentPicture(db.Model):
    __tablename__ = 'ascent_pictures'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    ascent_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('ascents.id')), nullable=False)
    picture_url = db.Column(db.String, nullable=False)
    uploaded_by = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())

    

    def to_dict(self):
        return {
            'id': self.id,
            'ascent_id': self.ascent_id,
            'picture_url': self.picture_url,
            'uploaded_by': self.uploaded_by,
            'created_at': self.created_at
        }
