from pydantic import BaseModel
from typing import Optional


class MedicalImageResponse(BaseModel):
    id: str
    image_uid: str
    project_id: str
    modality: str
    body_region: str
    file_format: str
    original_filename: str
    storage_path: str
    thumbnail_path: Optional[str] = None
    file_size: Optional[int] = None
    image_width: Optional[int] = None
    image_height: Optional[int] = None
    side: Optional[str] = None
    view_plane: Optional[str] = None
    image_quality: Optional[str] = None
    dataset_split: Optional[str] = None
    data_source: Optional[str] = None
    comment: Optional[str] = None
    upload_status: str

    class Config:
        from_attributes = True
