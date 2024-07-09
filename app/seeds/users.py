from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    # demo = User(
    #     username='Demo', email='demo@aa.io', password='password')
    # marnie = User(
    #     username='marnie', email='marnie@aa.io', password='password')
    # bobbie = User(
    #     username='bobbie', email='bobbie@aa.io', password='password')

    # db.session.add(demo)
    # db.session.add(marnie)
    # db.session.add(bobbie)
    # db.session.commit()

     users = [
        {
            'username': 'john_doe',
            'email': 'john@example.com',
            'password': 'password123',
            'first_name': 'John',
            'last_name': 'Doe',
            'bio': 'Climbing enthusiast and mountain lover.'
        },
        {
            'username': 'jane_smith',
            'email': 'jane@example.com',
            'password': 'password123',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'bio': 'Rock climber and adventure seeker.'
        },
        {
            'username': 'alice_wonder',
            'email': 'alice@example.com',
            'password': 'password123',
            'first_name': 'Alice',
            'last_name': 'Wonder',
            'bio': 'Nature lover and bouldering expert.'
        },
        {
            'username': 'bob_builder',
            'email': 'bob@example.com',
            'password': 'password123',
            'first_name': 'Bob',
            'last_name': 'Builder',
            'bio': 'Construction worker by day, climber by night.'
        },
        {
            'username': 'charlie_climber',
            'email': 'charlie@example.com',
            'password': 'password123',
            'first_name': 'Charlie',
            'last_name': 'Climber',
            'bio': 'Passionate about free climbing and adventure sports.'
        },
        {
            'username': 'demo',
            'email': 'demo@aa.io',
            'password': 'password',
            'first_name': 'Demo',
            'last_name': 'User',
            'bio': 'Passionate about free climbing and adventure sports.'
        },
    ]

     for user_data in users:
        user = User(
            username=user_data['username'],
            email=user_data['email'],
            password=user_data['password'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            bio=user_data['bio']
        )
        db.session.add(user)

     db.session.commit()
     print("Users seeded successfully!")




# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
