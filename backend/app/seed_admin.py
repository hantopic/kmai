from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.user import User

Base.metadata.create_all(bind=engine)

db = SessionLocal()

admin = db.query(User).filter(User.username == "admin").first()

if not admin:
    admin = User(
        username="admin",
        email="admin@kmai.local",
        full_name="KMAI Administrator",
        hashed_password=get_password_hash("admin1234"),
        role="admin",
        is_active=True,
    )
    db.add(admin)
    db.commit()
    print("Admin user created: admin / admin1234")
else:
    print("Admin user already exists")

db.close()
