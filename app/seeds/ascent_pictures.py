from app.models import db, AscentPicture, environment, SCHEMA
from sqlalchemy.sql import text

def seed_ascent_pictures():
    image1 = AscentPicture(
        ascent_id=1, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/the-casual-route-ascent-1.jpg", uploaded_by=1
    )
    image2 = AscentPicture(
        ascent_id=2, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/chain-reaction-ascent-1.jpg", uploaded_by=2
    )
    image3 = AscentPicture(
        ascent_id=3, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/serenity-sons-ascent-1.jpg", uploaded_by=3
    )
    image4 = AscentPicture(
        ascent_id=4, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/el-cap-nose-ascent-1.jpg", uploaded_by=4
    )
    image5 = AscentPicture(
        ascent_id=5, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/la-dura-dura-ascent-1.jpg", uploaded_by=5
    )
    image6 = AscentPicture(
        ascent_id=6, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/the-casual-route-ascent-2.jpg", uploaded_by=1
    )
    image7 = AscentPicture(
        ascent_id=7, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/chain-reaction-ascent-2.jpg", uploaded_by=2
    )
    image8 = AscentPicture(
        ascent_id=8, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/serenity-sons-ascent-2.jpg", uploaded_by=3
    )
    image9 = AscentPicture(
        ascent_id=9, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/el-cap-nose-ascent-2.jpg", uploaded_by=4
    )
    image10 = AscentPicture(
        ascent_id=10, picture_url="https://super-good-enough-photos.s3.us-east-2.amazonaws.com/la-dura-dura-ascent-2.jpg", uploaded_by=5
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

def undo_ascent_pictures():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.ascent_pictures RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM ascent_pictures"))

    db.session.commit()
