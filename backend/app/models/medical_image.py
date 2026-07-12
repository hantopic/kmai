import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime, BigInteger, Integer
from app.core.database import Base


class MedicalImage(Base):
    __tablename__ = "medical_images"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    image_uid = Column(String(50), unique=True, index=True, nullable=False)

    project_id = Column(String, nullable=False)

    modality = Column(String(50), default="ultrasound", nullable=False)
    body_region = Column(String(50), default="thyroid", nullable=False)

    file_format = Column(String(20), nullable=False)
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)
    storage_path = Column(Text, nullable=False)
    thumbnail_path = Column(Text, nullable=True)

    file_size = Column(BigInteger, nullable=True)
    image_width = Column(Integer, nullable=True)
    image_height = Column(Integer, nullable=True)
    sha256_hash = Column(String(128), nullable=True)

    side = Column(String(50), nullable=True)
    view_plane = Column(String(50), nullable=True)
    image_quality = Column(String(50), nullable=True)
    dataset_split = Column(String(50), nullable=True)
    data_source = Column(String(50), nullable=True)
    comment = Column(Text, nullable=True)

    upload_status = Column(String(50), default="uploaded")
    uploaded_by = Column(String, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    is_active = Column(Boolean, default=True)
