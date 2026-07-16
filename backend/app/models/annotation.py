import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    Column,
    DateTime,
    Float,
    ForeignKey,
    String,
    Text,
)

from app.core.database import Base


class Annotation(Base):
    __tablename__ = "annotations"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )

    image_id = Column(
        String,
        ForeignKey("medical_images.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    reviewer_id = Column(
        String,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    annotation_type = Column(
        String(30),
        nullable=False,
        default="rectangle",
    )

    # Normalized coordinates: 0.0–1.0
    x = Column(Float, nullable=True)
    y = Column(Float, nullable=True)
    width = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    points = Column(
        JSON,
        nullable=True,
    )

    label = Column(String(100), nullable=True)
    comment = Column(Text, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )