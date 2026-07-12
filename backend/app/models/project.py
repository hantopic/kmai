import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime
from app.core.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    modality = Column(String(100), default="ultrasound")
    body_region = Column(String(100), default="thyroid")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
