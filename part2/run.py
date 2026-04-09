from app import create_app, db
from app.models.place import Place
from app.models.user import User
from app.models.amenity import Amenity
from app import bcrypt

app = create_app()

with app.app_context():
    db.create_all()

    # Create test user if not exists
    if not User.query.first():
        user = User(
            email="admin@test.com",
            password="password123",
            first_name="Nasser",
            last_name="Alkhelaifi"
        )

        db.session.add(user)
        db.session.commit()    

        user = User.query.filter_by(email="admin@test.com").first()

        if not Place.query.first():
            places = [
        Place(
            title="Parc des Princes",
            description="Beautiful stadium in Paris",
            price=600,
            latitude=48.841436,
            longitude=2.253049,
            owner_id=user.id
        ),
        Place(
            title="Santiago Bernabeu",
            description="Iconic arena in Madrid",
            price=750,
            latitude=40.453054,
            longitude=-3.688344,
            owner_id=user.id
        ),
        Place(
            title="Westfalenstadion",
            description="Beautiful stadium in Dortmund",
            price=500,
            latitude=51.492811,
            longitude=7.451828,
            owner_id=user.id
        ),
        Place(
            title="La Bombonera",
            description="Historic arena in Buenos Aires",
            price=300,
            latitude=-34.635147,
            longitude=-58.364586,
            owner_id=user.id
        )
        ]

        db.session.add_all(places)
        db.session.commit()

from app import create_app, db
from app.models.place import Place
from app.models.user import User
from app.models.amenity import Amenity

app = create_app()

with app.app_context():
    db.create_all()

    if not User.query.filter_by(email="admin@test.com").first():
        user = User(
            email="admin@test.com",
            password="password123",
            first_name="Nasser",
            last_name="Alkhelaifi"
        )
        db.session.add(user)
        db.session.commit()

    if not User.query.filter_by(email="fan@test.com").first():
        fan = User(
            email="fan@test.com",
            password="password123",
            first_name="Kylian",
            last_name="MBAPPE"
        )
        db.session.add(fan)
        db.session.commit()

    user = User.query.filter_by(email="admin@test.com").first()

    if not Place.query.first():
        places = [
            Place(
                title="Parc des Princes",
                description="Beautiful stadium in Paris",
                price=100,
                latitude=48.841436,
                longitude=2.253049,
                owner_id=user.id
            ),
            Place(
                title="Santiago Bernabeu",
                description="Iconic stadium in Madrid",
                price=180,
                latitude=40.4531,
                longitude=-3.6883,
                owner_id=user.id
            ),
            Place(
                title="La Bombonera",
                description="Legendary stadium in Buenos Aires",
                price=120,
                latitude=-34.6356,
                longitude=-58.3647,
                owner_id=user.id
            ),
            Place(
                title="Westfalenstadion",
                description="Famous stadium in Dortmund",
                price=140,
                latitude=51.4926,
                longitude=7.4519,
                owner_id=user.id
            )
        ]
        db.session.add_all(places)
        db.session.commit()

    # Create amenities
    if not Amenity.query.first():
        parking = Amenity(name="Parking")
        museum = Amenity(name="Museum")
        vip = Amenity(name="VIP Lounge")
        food = Amenity(name="Food Court")

        db.session.add_all([parking, museum, vip, food])
        db.session.commit()

        parc = Place.query.filter_by(title="Parc des Princes").first()
        bernabeu = Place.query.filter_by(title="Santiago Bernabeu").first()
        bombonera = Place.query.filter_by(title="La Bombonera").first()
        westfalen = Place.query.filter_by(title="Westfalenstadion").first()

        parc.amenities.extend([parking, vip, food])
        bernabeu.amenities.extend([parking, museum, vip])
        bombonera.amenities.extend([food, museum])
        westfalen.amenities.extend([parking, food])

        db.session.commit()

if __name__ == "__main__":
    app.run(debug=True)