from app.models import db, ClimbingArea, environment, SCHEMA
from sqlalchemy.sql import text
import random

def seed_climbing_areas():

    states_us = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
        "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
        "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
        "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
        "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
        "New Hampshire", "New Jersey", "New Mexico", "New York",
        "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
        "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
        "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
        "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ]

    mexico_states = [
        "Aguascalientes", "Baja California", "Baja California Sur", "Campeche",
        "Chiapas", "Chihuahua", "Coahuila", "Colima", "Durango",
        "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Mexico City",
        "Mexico State", "Michoacán", "Morelos", "Nayarit", "Nuevo León",
        "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
        "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala",
        "Veracruz", "Yucatán", "Zacatecas"
    ]

    canadian_provinces = [
        "Alberta", "British Columbia", "Manitoba", "New Brunswick",
        "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island",
        "Quebec", "Saskatchewan", "Northwest Territories", "Nunavut", "Yukon"
    ]

    # Assume user IDs 1 through 5 are seeded
    user_ids = [1, 2, 3, 4, 5]

    usa = ClimbingArea(
        name="United States",
        parent_id=None,
        description="Climbing areas in the United States, known for diverse climbing spots from Yosemite's granite walls to the Red River Gorge's sandstone cliffs.",
        created_by=1,  # Assigning to user ID 1
    )
    db.session.add(usa)
    db.session.commit()


    mexico = ClimbingArea(
        name="Mexico",
        parent_id=None,
        description="Climbing areas in Mexico, featuring the famous El Potrero Chico and the rugged crags of Baja California.",
        created_by=2,  # Assigning to user ID 2
    )
    db.session.add(mexico)
    db.session.commit()


    canada = ClimbingArea(
        name="Canada",
        parent_id=None,
        description="Climbing areas in Canada, home to the Rockies, Squamish's granite, and ice climbing in Banff.",
        created_by=3,  # Assigning to user ID 3
    )
    db.session.add(canada)
    db.session.commit()


    for state in states_us:
        new_state_us = ClimbingArea(
            name=state,
            parent_id=1,  # United States has id = 1
            description=f"Climbing areas in {state}, offering a range of outdoor climbing experiences.",
            created_by=random.choice(user_ids),  # Randomly assign a created_by user ID
        )
        db.session.add(new_state_us)


    for state in mexico_states:
        new_state = ClimbingArea(
            name=state,
            parent_id=2,  # Mexico has id = 2
            description=f"Climbing areas in {state}, featuring unique landscapes and climbing routes.",
            created_by=random.choice(user_ids),  # Randomly assign a created_by user ID
        )
        db.session.add(new_state)


    for province in canadian_provinces:
        new_province = ClimbingArea(
            name=province,
            parent_id=3,  # Canada has id = 3
            description=f"Climbing areas in {province}, offering diverse climbing experiences and natural beauty.",
            created_by=random.choice(user_ids),  # Randomly assign a created_by user ID
        )
        db.session.add(new_province)




    db.session.commit()

def undo_climbing_areas():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.climbing_areas RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM climbing_areas"))

    db.session.commit()
