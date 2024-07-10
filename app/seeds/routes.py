from app.models import db, Route, environment, SCHEMA
from sqlalchemy.sql import text


def seed_routes():
    routes = [
        {
            'name': 'Chain Reaction',
            'grade': '5.12c',
            'location': 'Smith Rock, Oregon',
            'description': ' Four bolts lead up the arete, with funky pinching, scumming, crimping and pocket pulling to get through the technical crux between the second and third bolts. The redpoint crux is the sports action throw over the roof at the top, though.',
            'created_by': 1
        },
        {
            'name': 'Serenity/Sons',
            'grade': '5.10d',
            'location': 'Yosemite Valley, California',
            'description': 'the route combination Serenity-Sons: The first three pitches belong to the route Serenity Crack (5.10d) and after a transition slope the five pitches of Sons of Yesterday (5.10a) are added. This tour is an absolute pleasure, but it is not recommended as an entry tour for crack climbing. ',
            'created_by': 2
        },
        {
            'name': 'The Casual Route',
            'grade': '5.10a',
            'location': 'Rocky Mountain National Park, Colorado',
            'description': 'This 5.10a grade IV route is considered the easiest on the Diamond, but can feel more difficult due to altitude, cold, and exposure. It\'s a sustained and committing climb that involves a 5-mile approach to the 1,400-foot wall, with most of the climbing taking place over 13,000 feet of elevation. The Casual Route was first climbed in 1977 and is featured in Fifty Classic Climbs of North America.',
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
            'name': 'La Dura Dura',
            'grade': '5.15c',
            'location': 'Sant Honarat, Oliana, Spain',
            'description': 'The Hard Hard. Widely regarded as the most difficult sport climb in the world, La Dura Dura takes a direct line up the crag. Hard power endurance to a v14 crux, then 14c to finish. The low crux involves peanut-sized pinches and a heinous hand/foot match then a deadpoint to a decent hueco, the upper revolves around a long move to a horrible slopey tufa pinch. One repeat by Chris Sharma who bolted the route and worked it for several seasons with Adam Ondra, who made the first free ascent in 2013.',
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
