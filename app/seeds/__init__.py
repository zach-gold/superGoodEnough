from flask.cli import AppGroup
from .users import seed_users, undo_users
from .routes import seed_routes, undo_routes
from .route_pictures import seed_route_pictures, undo_route_pictures
from .ascents import seed_ascents, undo_ascents
from .ascent_pictures import seed_ascent_pictures, undo_ascent_pictures
from .climbing_areas import seed_climbing_areas, undo_climbing_areas

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
    seed_users()
    seed_climbing_areas()
    seed_routes()
    seed_route_pictures()
    seed_ascents()
    seed_ascent_pictures()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_ascent_pictures()
    undo_ascents()
    undo_route_pictures()
    undo_routes()
    undo_climbing_areas()
    undo_users()
    # Add other undo functions here
