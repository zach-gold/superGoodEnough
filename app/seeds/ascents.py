from app.models import db, Ascent, environment, SCHEMA
from datetime import datetime
from sqlalchemy.sql import text



def seed_ascents():

    ascents = [
        {
            'user_id': 1,
            'route_id': 3,
            'date': datetime(2023, 6, 15, 14, 30),
            'style': 'Alpine',
            'notes': 'Enjoyed the challenging moves near the top.'
        },
        {
            'user_id': 2,
            'route_id': 1,
            'date': datetime(2023, 6, 10, 10, 0),
            'style': 'Lead',
            'notes': 'Beautiful view from the top!'
        },
        {
            'user_id': 3,
            'route_id': 2,
            'date': datetime(2023, 5, 28, 9, 45),
            'style': 'Trad',
            'notes': 'Crux move was challenging but manageable.'
        },
        {
            'user_id': 4,
            'route_id': 4,
            'date': datetime(2023, 7, 2, 11, 15),
            'style': 'Trad',
            'notes': 'First time climbing this route, loved it!'
        },
        {
            'user_id': 5,
            'route_id': 5,
            'date': datetime(2023, 6, 5, 13, 0),
            'style': 'Lead',
            'notes': 'The crimps were sharper than expected.'
        },
        {
            'user_id': 1,
            'route_id': 3,
            'date': datetime(2023, 5, 20, 10, 45),
            'style': 'Alpine',
            'notes': 'Didn\'t anticipate the altitude getting to me'
        },
        {
            'user_id': 2,
            'route_id': 1,
            'date': datetime(2023, 6, 8, 12, 0),
            'style': 'Lead',
            'notes': 'Perfect weather made for an excellent climb.'
        },
        {
            'user_id': 3,
            'route_id': 2,
            'date': datetime(2023, 7, 1, 9, 0),
            'style': 'Trad',
            'notes': 'Early morning ascent, peaceful and serene.'
        },
        {
            'user_id': 4,
            'route_id': 4,
            'date': datetime(2023, 5, 25, 15, 30),
            'style': 'Trad',
            'notes': 'Pushed through the pump to reach the anchor.'
        },
        {
            'user_id': 5,
            'route_id': 5,
            'date': datetime(2023, 6, 12, 14, 15),
            'style': 'Top Rope',
            'notes': 'Literally impossible to lead climb'
        }
    ]

    for ascent_data in ascents:
        ascent = Ascent(
            user_id=ascent_data['user_id'],
            route_id=ascent_data['route_id'],
            date=ascent_data['date'],
            style=ascent_data['style'],
            notes=ascent_data['notes']
        )
        db.session.add(ascent)

    db.session.commit()
    print("Ascents seeded successfully!")





# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_ascents():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.ascents RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM ascents"))

    db.session.commit()
