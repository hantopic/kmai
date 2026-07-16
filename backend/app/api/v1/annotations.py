from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.api.v1.users import get_current_user
from app.core.database import get_db
from app.models.annotation import Annotation
from app.models.medical_image import MedicalImage
from app.models.user import User
from app.schemas.annotation import (
    AnnotationCreate,
    AnnotationResponse,
    AnnotationUpdate,
)

router = APIRouter()


def validate_rectangle(
    x: float,
    y: float,
    width: float,
    height: float,
) -> None:
    if x + width > 1.0 or y + height > 1.0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Annotation rectangle exceeds image boundaries",
        )


@router.post(
    "/annotations",
    response_model=AnnotationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_annotation(
    data: AnnotationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    image = (
        db.query(MedicalImage)
        .filter(MedicalImage.id == data.image_id)
        .first()
    )
     
    annotation = Annotation(
        image_id=data.image_id,
        reviewer_id=current_user.id,
        annotation_type=data.annotation_type,
        x=data.x,
        y=data.y,
        width=data.width,
        height=data.height,
        points=(
            [point.model_dump() for point in data.points]
            if data.points
            else None
        ),
        label=data.label,
        comment=data.comment,
    )

    db.add(annotation)
    db.commit()
    db.refresh(annotation)

    return annotation


@router.get(
    "/annotations",
    response_model=list[AnnotationResponse],
)
def list_annotations(
    image_id: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    del current_user

    return (
        db.query(Annotation)
        .filter(Annotation.image_id == image_id)
        .order_by(Annotation.created_at.asc())
        .all()
    )


@router.patch(
    "/annotations/{annotation_id}",
    response_model=AnnotationResponse,
)
def update_annotation(
    annotation_id: str,
    data: AnnotationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    annotation = (
        db.query(Annotation)
        .filter(Annotation.id == annotation_id)
        .first()
    )

    if annotation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Annotation not found",
        )

    if (
        annotation.reviewer_id != current_user.id
        and current_user.role != "admin"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot edit another reviewer's annotation",
        )

    updates = data.model_dump(exclude_unset=True)

    next_x = updates.get("x", annotation.x)
    next_y = updates.get("y", annotation.y)
    next_width = updates.get("width", annotation.width)
    next_height = updates.get("height", annotation.height)

    validate_rectangle(
        next_x,
        next_y,
        next_width,
        next_height,
    )

    for field, value in updates.items():
        setattr(annotation, field, value)

    db.commit()
    db.refresh(annotation)

    return annotation


@router.delete(
    "/annotations/{annotation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_annotation(
    annotation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    annotation = (
        db.query(Annotation)
        .filter(Annotation.id == annotation_id)
        .first()
    )

    if annotation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Annotation not found",
        )

    if (
        annotation.reviewer_id != current_user.id
        and current_user.role != "admin"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot delete another reviewer's annotation",
        )

    db.delete(annotation)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
