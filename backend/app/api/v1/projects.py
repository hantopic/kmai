from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.v1.users import get_current_user
from app.models.user import User
from app.models.project import Project

router = APIRouter()


class ProjectCreate(BaseModel):
    name: str
    description: str | None = None
    modality: str = "ultrasound"
    body_region: str = "thyroid"


@router.post("/projects")
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

    project = Project(
        name=data.name,
        description=data.description,
        modality=data.modality,
        body_region=data.body_region,
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


@router.get("/projects")
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    projects = db.query(Project).order_by(Project.created_at.desc()).all()
    return projects
