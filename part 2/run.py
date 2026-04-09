from app import create_app, db
from app.models.place import Place
from app.models.user import User
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

if __name__ == "__main__":
    app.run(debug=True)