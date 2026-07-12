from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.projects import router as projects_router
from app.api.v1.medical_images import router as medical_images_router

from app.core.database import Base, engine
from app.models.user import User
from app.models.project import Project
from app.models.medical_image import MedicalImage

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KMAI Backend API",
    description="Korean Medicine Artificial Intelligence Platform Backend",
    version="0.3.0",
)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


app.include_router(health_router, prefix="/api/v1", tags=["health"])
app.include_router(auth_router, prefix="/api/v1", tags=["auth"])
app.include_router(users_router, prefix="/api/v1", tags=["users"])
app.include_router(projects_router, prefix="/api/v1", tags=["projects"])
app.include_router(medical_images_router, prefix="/api/v1", tags=["medical images"])


@app.get("/")
def root():
    return {
        "message": "KMAI Backend API",
        "version": "0.3.0",
        "status": "running"
    }
