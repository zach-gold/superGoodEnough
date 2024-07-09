from app.models import db, Route, environment, SCHEMA
from sqlalchemy.sql import text


def seed_routes():
    routes = [
        {
            'name': 'The Great Wall',
            'grade': '5.10b',
            'location': 'Smith Rock, Oregon',
            'description': 'A classic sport climb with steep face climbing.',
            'created_by': 1
        },
        {
            'name': 'Yosemite Crack',
            'grade': '5.9',
            'location': 'Yosemite Valley, California',
            'description': 'Famous crack climb with stunning views.',
            'created_by': 2
        },
        {
            'name': 'The Diamond',
            'grade': '5.11c',
            'location': 'Rocky Mountain National Park, Colorado',
            'description': 'Multi-pitch adventure on a steep granite face.',
            'created_by': 3
        },
        {
            'name': 'El Capitan Nose',
            'grade': '5.14a',
            'location': 'Yosemite Valley, California',
            'description': 'Iconic big wall route, a testpiece of endurance.',
            'created_by': 4
        },
        {
            'name': 'Smith Rock Arch',
            'grade': '5.12b',
            'location': 'Smith Rock, Oregon',
            'description': 'Technical face climbing under the famous arch.',
            'created_by': 5
        },
    ]

    for route_data in routes:
        route = Route(
            name=route_data['name'],
            grade=route_data['grade'],
            location=route_data['location'],
            description=route_data['description'],
            created_by=route_data['created_by']
        )
        db.session.add(route)

    db.session.commit()
    print("Routes seeded successfully!")





# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_routes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.routes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM routes"))

    db.session.commit()
