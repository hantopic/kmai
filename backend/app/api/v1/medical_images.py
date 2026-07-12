import shutil
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.api.v1.users import get_current_user
from app.core.database import get_db
from app.models.medical_image import MedicalImage
from app.models.user import User
from app.services.medical_image_service import (
    build_storage_paths,
    calculate_sha256,
    create_thumbnail,
    generate_image_uid,
    get_image_size,
    validate_file_extension,
)

router = APIRouter()


@router.post("/medical-images/upload")
def upload_medical_image(
    file: UploadFile = File(...),
    project_id: str = Form(...),
    modality: str = Form("ultrasound"),
    body_region: str = Form("thyroid"),
    side: Optional[str] = Form(None),
    view_plane: Optional[str] = Form(None),
    image_quality: Optional[str] = Form(None),
    dataset_split: Optional[str] = Form(None),
    data_source: Optional[str] = Form(None),
    comment: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        file_format = validate_file_extension(file.filename)
    except ValueError:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    uid_modality = "US" if modality.lower() == "ultrasound" else modality[:3].upper()
    uid_region = "THY" if body_region.lower() == "thyroid" else body_region[:3].upper()

    image_uid = generate_image_uid(uid_modality, uid_region)

    stored_filename, storage_path, thumbnail_path = build_storage_paths(
        project_id=project_id,
        image_uid=image_uid,
        file_ext=file_format,
    )

    with open(storage_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = file.file.tell()

    sha256_hash = calculate_sha256(storage_path)
    image_width, image_height = get_image_size(storage_path)

    thumbnail_created = create_thumbnail(storage_path, thumbnail_path)
    final_thumbnail_path = thumbnail_path if thumbnail_created else None

    medical_image = MedicalImage(
        image_uid=image_uid,
        project_id=project_id,
        modality=modality,
        body_region=body_region,
        file_format=file_format,
        original_filename=file.filename,
        stored_filename=stored_filename,
        storage_path=storage_path,
        thumbnail_path=final_thumbnail_path,
        file_size=file_size,
        image_width=image_width,
        image_height=image_height,
        sha256_hash=sha256_hash,
        side=side,
        view_plane=view_plane,
        image_quality=image_quality,
        dataset_split=dataset_split,
        data_source=data_source,
        comment=comment,
        upload_status="uploaded",
        uploaded_by=current_user.id,
    )

    db.add(medical_image)
    db.commit()
    db.refresh(medical_image)

    return medical_image


@router.get("/medical-images")
def list_medical_images(
    project_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(MedicalImage)

    if project_id:
        query = query.filter(MedicalImage.project_id == project_id)

    return query.order_by(MedicalImage.uploaded_at.desc()).all()
