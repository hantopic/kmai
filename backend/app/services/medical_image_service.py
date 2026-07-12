import hashlib
import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional

from PIL import Image


ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".tif",
    ".tiff",
    ".bmp",
    ".dcm",
}


def generate_image_uid(modality: str = "US", body_region: str = "THY") -> str:
    year = datetime.utcnow().year
    random_part = str(uuid.uuid4())[:8].upper()
    return f"KMAI-{modality.upper()}-{body_region.upper()}-{year}-{random_part}"


def validate_file_extension(filename: str) -> str:
    ext = Path(filename).suffix.lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError("Unsupported file format")

    return ext.replace(".", "")


def calculate_sha256(file_path: str) -> str:
    sha256 = hashlib.sha256()

    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            sha256.update(chunk)

    return sha256.hexdigest()


def get_image_size(file_path: str) -> tuple[Optional[int], Optional[int]]:
    try:
        with Image.open(file_path) as img:
            return img.width, img.height
    except Exception:
        return None, None


def create_thumbnail(file_path: str, thumbnail_path: str) -> bool:
    try:
        with Image.open(file_path) as img:
            img.thumbnail((300, 300))
            img.convert("RGB").save(thumbnail_path, "JPEG")
        return True
    except Exception:
        return False


def build_storage_paths(project_id: str, image_uid: str, file_ext: str):
    now = datetime.utcnow()
    year = str(now.year)
    month = f"{now.month:02d}"

    base_dir = Path("uploads") / "medical_images" / year / month / project_id
    thumb_dir = Path("uploads") / "thumbnails" / year / month / project_id

    os.makedirs(base_dir, exist_ok=True)
    os.makedirs(thumb_dir, exist_ok=True)

    stored_filename = f"{image_uid}.{file_ext}"
    storage_path = base_dir / stored_filename
    thumbnail_path = thumb_dir / f"{image_uid}.jpg"

    return stored_filename, str(storage_path), str(thumbnail_path)
