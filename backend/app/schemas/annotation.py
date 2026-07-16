from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, model_validator

class AnnotationPoint(BaseModel):
    x: float = Field(ge=0.0, le=1.0)
    y: float = Field(ge=0.0, le=1.0)

class AnnotationCreate(BaseModel):
    image_id: str
    annotation_type: Literal["rectangle", "polygon"] = "rectangle"

    x: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    y: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    width: Optional[float] = Field(default=None, gt=0.0, le=1.0)
    height: Optional[float] = Field(default=None, gt=0.0, le=1.0)

    points: Optional[list[AnnotationPoint]] = None

    label: Optional[str] = None
    comment: Optional[str] = None

    @model_validator(mode="after")
    def validate_geometry(self):
        if self.annotation_type == "rectangle":
            rectangle_values = (
                self.x,
                self.y,
                self.width,
                self.height,
            )

            if any(value is None for value in rectangle_values):
                raise ValueError(
                    "Rectangle annotations require x, y, width, and height"
                )

            if self.x + self.width > 1.0:
                raise ValueError(
                    "Rectangle exceeds the right image boundary"
                )

            if self.y + self.height > 1.0:
                raise ValueError(
                    "Rectangle exceeds the bottom image boundary"
                )

            self.points = None

        if self.annotation_type == "polygon":
            if not self.points or len(self.points) < 3:
                raise ValueError(
                    "Polygon annotations require at least three points"
                )

            self.x = None
            self.y = None
            self.width = None
            self.height = None

        return self

class AnnotationUpdate(BaseModel):
    x: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    y: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    width: Optional[float] = Field(default=None, gt=0.0, le=1.0)
    height: Optional[float] = Field(default=None, gt=0.0, le=1.0)

    points: Optional[list[AnnotationPoint]] = None

    label: Optional[str] = None
    comment: Optional[str] = None


class AnnotationResponse(BaseModel):
    id: str
    image_id: str
    reviewer_id: Optional[str]
    annotation_type: str

    x: Optional[float]
    y: Optional[float]
    width: Optional[float]
    height: Optional[float]

    points: Optional[list[AnnotationPoint]]

    label: Optional[str]
    comment: Optional[str]

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)