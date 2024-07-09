from .db import db, environment, SCHEMA, add_prefix_for_prod


class Comment(db.Model):
    __tablename__ = 'comments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    route_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('routes.id')))
    ascent_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('ascents.id')))
    content = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now(), onupdate=db.func.now())
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'route_id': self.route_id,
            'ascent_id': self.ascent_id,
            'content': self.content,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
