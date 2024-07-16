from .db import db, environment, SCHEMA, add_prefix_for_prod


class Route(db.Model):
    __tablename__ = 'routes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    grade = db.Column(db.String(10))
    location = db.Column(db.String(255))
    area_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('climbing_areas.id')))
    description = db.Column(db.String(2000))
    created_by = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now(), onupdate=db.func.now())

    ascents = db.relationship('Ascent', cascade="all, delete")
    pictures = db.relationship('RoutePicture', cascade="all, delete")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'grade': self.grade,
            'location': self.location,
            'area_id': self.area_id,
            'description': self.description,
            'created_by': self.created_by,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
