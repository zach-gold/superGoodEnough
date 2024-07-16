from .db import db, environment, SCHEMA, add_prefix_for_prod


class Ascent(db.Model):
    __tablename__ = 'ascents'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    route_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('routes.id')), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    style = db.Column(db.String(25))
    notes = db.Column(db.String(2000))
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now(), onupdate=db.func.now())

    pictures = db.relationship('AscentPicture', cascade="all, delete")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'route_id': self.route_id,
            'date': self.date,
            'style': self.style,
            'notes': self.notes,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
