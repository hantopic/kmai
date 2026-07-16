# KMAI API Specification

Document ID: KMAI-API-001  
Version: 0.1.0  
Status: Draft  
Platform: KMAI Medical Image Reading Platform  
Last Updated: July 2026

---

## 1. Purpose

This document defines the REST API structure of the KMAI platform.

The API supports:

- Authentication
- User management
- Project management
- Medical image upload and retrieval
- Annotation management
- Lesion management
- Structured reading
- Report generation
- Data export
- Future AI-assisted interpretation

The current backend is implemented with FastAPI.

---

## 2. Base URL

Production:

```text
https://ai.hantopic.kr/api/v1
```

Development backend:

```text
http://127.0.0.1:8010/api/v1
```

Development frontend proxy:

```text
http://114.207.245.126:3000/api/v1
```

Swagger documentation:

```text
https://ai.hantopic.kr/docs
```

OpenAPI JSON:

```text
https://ai.hantopic.kr/openapi.json
```

---

## 3. API Versioning

The current API version is:

```text
v1
```

All current endpoints use the following prefix:

```text
/api/v1
```

Future breaking changes should use a new version prefix.

Example:

```text
/api/v2
```

---

## 4. Authentication

KMAI uses JWT Bearer authentication.

Protected requests must include:

```http
Authorization: Bearer <access_token>
```

Example:

```http
GET /api/v1/projects
Authorization: Bearer eyJhbGciOi...
```

---

## 5. Common Request Headers

JSON request:

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <access_token>
```

File upload:

```http
Content-Type: multipart/form-data
Authorization: Bearer <access_token>
```

---

## 6. Common Response Format

Successful object response:

```json
{
  "id": "uuid",
  "created_at": "2026-07-17T12:00:00"
}
```

Successful list response:

```json
[
  {
    "id": "uuid-1"
  },
  {
    "id": "uuid-2"
  }
]
```

Error response:

```json
{
  "detail": "Error message"
}
```

Validation error:

```json
{
  "detail": [
    {
      "loc": [
        "body",
        "field_name"
      ],
      "msg": "Validation error message",
      "type": "validation_error"
    }
  ]
}
```

---

## 7. HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Request completed successfully |
| 201 | Resource created |
| 204 | Resource deleted successfully |
| 400 | Invalid request |
| 401 | Authentication required or token invalid |
| 403 | Access forbidden |
| 404 | Resource not found |
| 409 | Resource conflict |
| 413 | Uploaded file too large |
| 415 | Unsupported file format |
| 422 | Validation error |
| 500 | Internal server error |

---

## 8. Health API

### 8.1 Health Check

```http
GET /api/v1/health
```

Authentication:

```text
Not required
```

Response:

```json
{
  "status": "ok"
}
```

---

## 9. Authentication API

### 9.1 Login

```http
POST /api/v1/auth/login
```

Request:

```json
{
  "username": "admin",
  "password": "password"
}
```

Response:

```json
{
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

Possible errors:

```text
401 Invalid username or password
```

---

## 10. User API

### 10.1 Read Current User

```http
GET /api/v1/users/me
```

Authentication:

```text
Required
```

Response:

```json
{
  "id": "user-uuid",
  "username": "admin",
  "email": "admin@example.com",
  "role": "admin"
}
```

### 10.2 List Users

```http
GET /api/v1/users
```

Authentication:

```text
Required
```

Recommended authorization:

```text
Admin only
```

Response:

```json
[
  {
    "id": "user-uuid",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
]
```

---

## 11. Project API

### 11.1 List Projects

```http
GET /api/v1/projects
```

Authentication:

```text
Required
```

Response:

```json
[
  {
    "id": "project-uuid",
    "name": "Thyroid Ultrasound Consensus 2026",
    "description": "Thyroid ultrasound reading project",
    "modality": "ultrasound",
    "body_region": "thyroid",
    "is_active": true,
    "created_at": "2026-07-07T13:59:36"
  }
]
```

### 11.2 Create Project

```http
POST /api/v1/projects
```

Request:

```json
{
  "name": "Thyroid Ultrasound Reading 2026",
  "description": "Thyroid ultrasound interpretation project",
  "modality": "ultrasound",
  "body_region": "thyroid"
}
```

Response:

```json
{
  "id": "project-uuid",
  "name": "Thyroid Ultrasound Reading 2026",
  "description": "Thyroid ultrasound interpretation project",
  "modality": "ultrasound",
  "body_region": "thyroid",
  "is_active": true,
  "created_at": "2026-07-17T12:00:00"
}
```

---

## 12. Medical Image API

### 12.1 Upload Medical Image

```http
POST /api/v1/medical-images/upload
```

Content type:

```text
multipart/form-data
```

Required fields:

```text
file
project_id
```

Optional fields:

```text
modality
body_region
view_plane
side
dataset_split
data_source
comment
```

Privacy requirement:

The upload form must not collect direct patient identifiers.

Prohibited fields include:

- Patient ID
- Patient name
- Date of birth
- Resident registration number
- Hospital registration number
- Phone number
- Address

Example request fields:

```text
file: thyroid.png
project_id: project-uuid
modality: ultrasound
body_region: thyroid
```

Response:

```json
{
  "id": "image-uuid",
  "image_uid": "KMAI-US-THY-2026-84D6B9BE",
  "project_id": "project-uuid",
  "original_filename": "thyroid.png",
  "stored_filename": "KMAI-US-THY-2026-84D6B9BE.png",
  "file_format": "png",
  "modality": "ultrasound",
  "body_region": "thyroid",
  "image_width": 1412,
  "image_height": 924,
  "storage_path": "uploads/medical_images/2026/07/project-uuid/file.png",
  "thumbnail_path": "uploads/thumbnails/2026/07/project-uuid/file.jpg",
  "sha256_hash": "hash-value",
  "upload_status": "uploaded",
  "uploaded_at": "2026-07-17T12:00:00"
}
```

Supported formats:

```text
JPG
JPEG
PNG
TIFF
TIF
BMP
DICOM
```

### 12.2 List Medical Images

```http
GET /api/v1/medical-images
```

Query parameters:

```text
project_id
```

Example:

```http
GET /api/v1/medical-images?project_id=project-uuid
```

Response:

```json
[
  {
    "id": "image-uuid",
    "image_uid": "KMAI-US-THY-2026-84D6B9BE",
    "project_id": "project-uuid",
    "original_filename": "thyroid.png",
    "file_format": "png",
    "modality": "ultrasound",
    "body_region": "thyroid",
    "image_width": 1412,
    "image_height": 924,
    "storage_path": "uploads/medical_images/file.png",
    "thumbnail_path": "uploads/thumbnails/file.jpg",
    "sha256_hash": "hash-value",
    "uploaded_at": "2026-07-17T12:00:00"
  }
]
```

### 12.3 Read Medical Image

Planned endpoint:

```http
GET /api/v1/medical-images/{image_id}
```

Response:

```json
{
  "id": "image-uuid",
  "image_uid": "KMAI-US-THY-2026-84D6B9BE",
  "project_id": "project-uuid",
  "original_filename": "thyroid.png",
  "storage_path": "uploads/medical_images/file.png",
  "thumbnail_path": "uploads/thumbnails/file.jpg"
}
```

### 12.4 Delete Medical Image

Planned endpoint:

```http
DELETE /api/v1/medical-images/{image_id}
```

Recommended behavior:

- Verify authorization
- Delete thumbnails
- Delete annotations
- Delete lesions
- Delete reports
- Delete stored file
- Record an audit event

Response:

```text
204 No Content
```

---

## 13. Annotation API

### 13.1 Create Annotation

```http
POST /api/v1/annotations
```

Rectangle request:

```json
{
  "image_id": "image-uuid",
  "annotation_type": "rectangle",
  "x": 0.25,
  "y": 0.30,
  "width": 0.20,
  "height": 0.18,
  "label": "nodule",
  "comment": "Suspected thyroid nodule"
}
```

Polygon request:

```json
{
  "image_id": "image-uuid",
  "annotation_type": "polygon",
  "points": [
    {
      "x": 0.20,
      "y": 0.25
    },
    {
      "x": 0.35,
      "y": 0.22
    },
    {
      "x": 0.42,
      "y": 0.40
    },
    {
      "x": 0.28,
      "y": 0.48
    }
  ],
  "label": "nodule",
  "comment": "Polygon boundary"
}
```

Coordinate system:

```text
Normalized coordinates
Range: 0.0–1.0
Origin: top-left
```

Response:

```json
{
  "id": "annotation-uuid",
  "image_id": "image-uuid",
  "reviewer_id": "user-uuid",
  "annotation_type": "rectangle",
  "x": 0.25,
  "y": 0.30,
  "width": 0.20,
  "height": 0.18,
  "points": null,
  "label": "nodule",
  "comment": "Suspected thyroid nodule",
  "created_at": "2026-07-17T12:00:00",
  "updated_at": "2026-07-17T12:00:00"
}
```

### 13.2 List Annotations

```http
GET /api/v1/annotations
```

Required query parameter:

```text
image_id
```

Example:

```http
GET /api/v1/annotations?image_id=image-uuid
```

Response:

```json
[
  {
    "id": "annotation-uuid",
    "image_id": "image-uuid",
    "reviewer_id": "user-uuid",
    "annotation_type": "rectangle",
    "x": 0.25,
    "y": 0.30,
    "width": 0.20,
    "height": 0.18,
    "points": null,
    "label": "nodule",
    "comment": "Suspected thyroid nodule",
    "created_at": "2026-07-17T12:00:00",
    "updated_at": "2026-07-17T12:00:00"
  }
]
```

### 13.3 Update Annotation

```http
PATCH /api/v1/annotations/{annotation_id}
```

Request:

```json
{
  "label": "thyroid nodule",
  "comment": "Updated interpretation"
}
```

Rectangle geometry update:

```json
{
  "x": 0.28,
  "y": 0.31,
  "width": 0.19,
  "height": 0.17
}
```

Response:

```json
{
  "id": "annotation-uuid",
  "image_id": "image-uuid",
  "reviewer_id": "user-uuid",
  "annotation_type": "rectangle",
  "x": 0.28,
  "y": 0.31,
  "width": 0.19,
  "height": 0.17,
  "points": null,
  "label": "thyroid nodule",
  "comment": "Updated interpretation",
  "created_at": "2026-07-17T12:00:00",
  "updated_at": "2026-07-17T12:10:00"
}
```

Authorization rule:

- The original reviewer may update the annotation.
- An administrator may update any annotation.
- Other users should receive `403 Forbidden`.

### 13.4 Delete Annotation

```http
DELETE /api/v1/annotations/{annotation_id}
```

Response:

```text
204 No Content
```

Authorization rule:

- The original reviewer may delete the annotation.
- An administrator may delete any annotation.
- Other users should receive `403 Forbidden`.

---

## 14. Lesion API

Status:

```text
Planned
```

### 14.1 Create Lesion

```http
POST /api/v1/lesions
```

Request:

```json
{
  "image_id": "image-uuid",
  "lesion_number": 1,
  "lesion_type": "nodule",
  "lobe": "right",
  "location": "upper",
  "long_axis_mm": 12.3,
  "short_axis_mm": 8.4,
  "ap_mm": 7.1
}
```

Response:

```json
{
  "id": "lesion-uuid",
  "image_id": "image-uuid",
  "lesion_number": 1,
  "lesion_type": "nodule",
  "lobe": "right",
  "location": "upper",
  "long_axis_mm": 12.3,
  "short_axis_mm": 8.4,
  "ap_mm": 7.1,
  "tirads_score": null,
  "tirads_category": null,
  "created_at": "2026-07-17T12:00:00"
}
```

### 14.2 List Lesions

```http
GET /api/v1/lesions?image_id=image-uuid
```

Response:

```json
[
  {
    "id": "lesion-uuid",
    "image_id": "image-uuid",
    "lesion_number": 1,
    "lesion_type": "nodule",
    "lobe": "right",
    "location": "upper"
  }
]
```

### 14.3 Update Lesion

```http
PATCH /api/v1/lesions/{lesion_id}
```

Request:

```json
{
  "composition": "solid",
  "echogenicity": "hypoechoic",
  "shape": "wider_than_tall",
  "margin": "smooth",
  "echogenic_foci": "none"
}
```

### 14.4 Delete Lesion

```http
DELETE /api/v1/lesions/{lesion_id}
```

Response:

```text
204 No Content
```

---

## 15. Structured Reading API

Status:

```text
Planned
```

### 15.1 Create Reading Report

```http
POST /api/v1/reports
```

Request:

```json
{
  "image_id": "image-uuid",
  "findings": "A solid hypoechoic nodule is present in the right thyroid lobe.",
  "impression": "ACR TI-RADS TR4 thyroid nodule.",
  "recommendation": "Follow-up ultrasound is recommended.",
  "report_status": "draft"
}
```

Response:

```json
{
  "id": "report-uuid",
  "image_id": "image-uuid",
  "findings": "A solid hypoechoic nodule is present in the right thyroid lobe.",
  "impression": "ACR TI-RADS TR4 thyroid nodule.",
  "recommendation": "Follow-up ultrasound is recommended.",
  "report_status": "draft",
  "reviewer_id": "user-uuid",
  "created_at": "2026-07-17T12:00:00",
  "updated_at": "2026-07-17T12:00:00"
}
```

### 15.2 Read Report

```http
GET /api/v1/reports/{report_id}
```

### 15.3 List Reports by Image

```http
GET /api/v1/reports?image_id=image-uuid
```

### 15.4 Update Report

```http
PATCH /api/v1/reports/{report_id}
```

### 15.5 Finalize Report

Planned endpoint:

```http
POST /api/v1/reports/{report_id}/finalize
```

Recommended behavior:

- Validate required fields
- Record final reviewer
- Record approval timestamp
- Prevent silent overwrite
- Preserve revision history

---

## 16. Export API

Current export functions are implemented in the browser.

Current formats:

```text
Original Image
Annotated PNG
Annotation JSON
```

Future backend export endpoints are recommended.

### 16.1 Export Annotated Image

```http
GET /api/v1/exports/images/{image_id}/annotated
```

Response type:

```text
image/png
```

### 16.2 Export Annotation JSON

```http
GET /api/v1/exports/images/{image_id}/annotations
```

Response type:

```text
application/json
```

### 16.3 Export PDF Report

```http
GET /api/v1/exports/reports/{report_id}/pdf
```

Response type:

```text
application/pdf
```

### 16.4 Export Word Report

```http
GET /api/v1/exports/reports/{report_id}/docx
```

Response type:

```text
application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

### 16.5 Export Project Dataset

```http
POST /api/v1/exports/projects/{project_id}
```

Request:

```json
{
  "formats": [
    "original_images",
    "annotated_images",
    "annotation_json",
    "yolo",
    "coco"
  ]
}
```

Response:

```json
{
  "job_id": "export-job-uuid",
  "status": "queued"
}
```

---

## 17. AI Assistance API

Status:

```text
Planned
```

### 17.1 Generate AI Reading Draft

```http
POST /api/v1/ai/reports/draft
```

Request:

```json
{
  "image_id": "image-uuid",
  "lesion_ids": [
    "lesion-uuid"
  ],
  "requested_sections": [
    "findings",
    "impression",
    "recommendation"
  ]
}
```

Response:

```json
{
  "ai_model": "model-name",
  "findings": "Draft findings",
  "impression": "Draft impression",
  "recommendation": "Draft recommendation",
  "confidence": 0.86,
  "status": "draft"
}
```

AI output requirements:

- Must be labeled as AI-generated draft
- Must not be finalized automatically
- Must require user review
- Must record model name and version
- Must support accept, modify, or reject workflow

---

## 18. Audit API

Status:

```text
Planned
```

Recommended endpoint:

```http
GET /api/v1/audit-events
```

Recommended audit events:

- Login
- Failed login
- Project creation
- Image upload
- Image deletion
- Annotation creation
- Annotation update
- Annotation deletion
- Lesion creation
- Report finalization
- Data export
- AI draft generation

---

## 19. Pagination

List endpoints should support pagination when datasets become large.

Recommended query parameters:

```text
limit
offset
```

Example:

```http
GET /api/v1/medical-images?project_id=project-uuid&limit=100&offset=0
```

Recommended response:

```json
{
  "items": [],
  "total": 1250,
  "limit": 100,
  "offset": 0
}
```

---

## 20. Filtering and Sorting

Recommended medical image filters:

```text
project_id
modality
body_region
file_format
uploaded_by
uploaded_after
uploaded_before
```

Recommended sorting:

```text
sort_by
sort_order
```

Example:

```http
GET /api/v1/medical-images?project_id=project-uuid&sort_by=uploaded_at&sort_order=desc
```

---

## 21. File Upload Validation

The backend should verify:

- Filename extension
- MIME type
- Actual file content
- File size
- Image dimensions
- DICOM validity
- Duplicate SHA-256 hash
- De-identification status
- Malware risk

Recommended maximum file size should be configurable.

---

## 22. Privacy Requirements

The API must not require or expose direct patient identifiers in the standard image-upload workflow.

Do not use the following fields:

```text
patient_id
patient_name
date_of_birth
resident_registration_number
hospital_registration_number
phone_number
address
```

Use system-generated anonymous identifiers:

```text
image_uid
lesion_uid
report_uid
```

---

## 23. Security Requirements

Required controls:

- HTTPS
- JWT validation
- Token expiration
- Role-based access control
- Secure password hashing
- Protected upload routes
- Protected download routes
- Input validation
- SQL injection protection
- Path traversal protection
- File type validation
- Audit logging
- Rate limiting
- Backup and recovery

---

## 24. Role-Based Authorization

Recommended roles:

| Role | Access |
|---|---|
| Admin | Full system access |
| Reader | Image review, annotation, reading, report |
| Reviewer | Review and approve reports |
| Researcher | Research data and approved exports |
| Viewer | Read-only access |

---

## 25. API Testing

Recommended test categories:

- Authentication tests
- Authorization tests
- Project API tests
- Upload tests
- Medical image retrieval tests
- Annotation CRUD tests
- Rectangle boundary validation
- Polygon validation
- Delete permission tests
- Invalid token tests
- File validation tests
- Privacy tests
- Export tests

Example backend syntax test:

```bash
python3 -m compileall backend/app
```

Swagger test:

```text
https://ai.hantopic.kr/docs
```

---

## 26. Current API Implementation Status

Implemented:

```text
GET    /api/v1/health
POST   /api/v1/auth/login
GET    /api/v1/users/me
GET    /api/v1/users
GET    /api/v1/projects
POST   /api/v1/projects
POST   /api/v1/medical-images/upload
GET    /api/v1/medical-images
POST   /api/v1/annotations
GET    /api/v1/annotations
PATCH  /api/v1/annotations/{annotation_id}
DELETE /api/v1/annotations/{annotation_id}
```

Planned:

```text
GET    /api/v1/medical-images/{image_id}
DELETE /api/v1/medical-images/{image_id}

POST   /api/v1/lesions
GET    /api/v1/lesions
PATCH  /api/v1/lesions/{lesion_id}
DELETE /api/v1/lesions/{lesion_id}

POST   /api/v1/reports
GET    /api/v1/reports
GET    /api/v1/reports/{report_id}
PATCH  /api/v1/reports/{report_id}
POST   /api/v1/reports/{report_id}/finalize

GET    /api/v1/exports/images/{image_id}/annotated
GET    /api/v1/exports/images/{image_id}/annotations
GET    /api/v1/exports/reports/{report_id}/pdf
GET    /api/v1/exports/reports/{report_id}/docx

POST   /api/v1/ai/reports/draft
```

---

## 27. Change Management

Any API change should update:

- FastAPI route
- Pydantic schema
- SQLAlchemy model
- Database migration
- Frontend service
- Swagger documentation
- This specification
- CHANGELOG.md
- Automated tests

Breaking changes require a new API version or documented migration path.
