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

    if not Place.query.first():
        user = User.query.filter_by(email="admin@test.com").first()

        place = Place(
            title="Parc des Princes",
            description="Beautiful stadium in Paris",
            price=100,
            latitude=48.841436,
            longitude=2.253049,
            owner_id=user.id
        )

        db.session.add(place)
        db.session.commit()

if __name__ == "__main__":
    app.run(debug=True)