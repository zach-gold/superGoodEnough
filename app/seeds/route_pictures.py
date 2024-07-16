from app.models import db, RoutePicture, environment, SCHEMA
from sqlalchemy.sql import text

def seed_route_pictures():
    image1 = RoutePicture(
        route_id=1, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/chain-reaction-1.jpg", uploaded_by=1
    )
    image2 = RoutePicture(
        route_id=1, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/chain-reaction-2.jpg", uploaded_by=1
    )
    image3 = RoutePicture(
        route_id=2, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/serenity-sons-1.jpg", uploaded_by=2
    )
    image4 = RoutePicture(
        route_id=2, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/serenity-sons-2.jpg", uploaded_by=2
    )
    image5 = RoutePicture(
        route_id=3, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/the-casual-route-1.jpg", uploaded_by=3
    )
    image6 = RoutePicture(
        route_id=3, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/the-casual-route-2.jpg", uploaded_by=3
    )
    image7 = RoutePicture(
        route_id=4, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/el-cap-nose-1.jpg", uploaded_by=4
    )
    image8 = RoutePicture(
        route_id=4, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/el-cap-nose-2.jpg", uploaded_by=4
    )
    image9 = RoutePicture(
        route_id=5, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/la-dura-dura-1.jpg", uploaded_by=5
    )
    image10 = RoutePicture(
        route_id=5, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/la-dura-dura-2.jpg", uploaded_by=5
    )

    db.session.add(image1)
    db.session.add(image2)
    db.session.add(image3)
    db.session.add(image4)
    db.session.add(image5)
    db.session.add(image6)
    db.session.add(image7)
    db.session.add(image8)
    db.session.add(image9)
    db.session.add(image10)
    db.session.commit()

def undo_route_pictures():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.route_pictures RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM route_pictures"))

    db.session.commit()
