# KMAI API Specification

**Document ID:** KMAI-API-001  
**Version:** 0.1.0  
**Status:** Phase 1 – Thyroid Ultrasound Consensus Platform  
**Last Updated:** July 2026  
**Project:** KMAI (Korean Medicine Artificial Intelligence Platform)

---

## 1. Overview

This document defines the initial REST API structure for the KMAI Platform.

The API is designed to support:

- User authentication
- Role-based access control
- Project management
- Thyroid ultrasound image upload
- Image metadata management
- Expert review
- Consensus labeling
- Dataset export

---

## 2. API Base URL

```text
https://ai.hantopic.kr/api/v1
```

---

## 3. Authentication

### 3.1 Login

```http
POST /auth/login
```

Request:

```json
{
  "username": "reader1",
  "password": "password"
}
```

Response:

```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "username": "reader1",
    "role": "reader"
  }
}
```

---

### 3.2 Get Current User

```http
GET /auth/me
```

Required role:

```text
admin, reader, uploader, researcher
```

Response:

```json
{
  "id": "uuid",
  "username": "reader1",
  "email": "reader1@example.com",
  "role": "reader",
  "is_active": true
}
```

---

## 4. Users API

### 4.1 Create User

```http
POST /users
```

Required role:

```text
admin
```

Request:

```json
{
  "username": "reader1",
  "email": "reader1@example.com",
  "password": "password",
  "role": "reader"
}
```

Response:

```json
{
  "id": "uuid",
  "username": "reader1",
  "email": "reader1@example.com",
  "role": "reader",
  "is_active": true
}
```

---

### 4.2 List Users

```http
GET /users
```

Required role:

```text
admin
```

---

## 5. Projects API

### 5.1 Create Project

```http
POST /projects
```

Required role:

```text
admin
```

Request:

```json
{
  "name": "Thyroid Ultrasound",
  "description": "Thyroid ultrasound consensus labeling project",
  "modality": "ultrasound",
  "body_region": "thyroid"
}
```

---

### 5.2 List Projects

```http
GET /projects
```

Required role:

```text
admin, reader, uploader, researcher
```

---

## 6. Images API

### 6.1 Upload Image

```http
POST /images/upload
```

Required role:

```text
admin, uploader
```

Content type:

```text
multipart/form-data
```

Form fields:

| Field | Required | Description |
|---|---|---|
| file | yes | Ultrasound image file |
| project_id | yes | Project UUID |
| modality | yes | ultrasound |
| body_region | yes | thyroid |
| side | no | left, right, isthmus, unknown |
| view_plane | no | transverse, longitudinal, unknown |
| quality | no | good, fair, poor |

Response:

```json
{
  "id": "uuid",
  "image_uid": "KMAI-THY-000001",
  "stored_path": "uploads/thyroid/KMAI-THY-000001.png",
  "status": "uploaded"
}
```

---

### 6.2 List Images

```http
GET /images
```

Required role:

```text
admin, reader, uploader, researcher
```

Query parameters:

| Parameter | Description |
|---|---|
| project_id | Filter by project |
| status | uploaded, reviewed, consensus_completed |
| body_region | thyroid, carotid, abdomen, shoulder |
| label | Filter by consensus label |

---

### 6.3 Get Image Detail

```http
GET /images/{image_id}
```

Required role:

```text
admin, reader, uploader, researcher
```

Response:

```json
{
  "id": "uuid",
  "image_uid": "KMAI-THY-000001",
  "modality": "ultrasound",
  "body_region": "thyroid",
  "side": "right",
  "view_plane": "transverse",
  "quality": "good",
  "status": "uploaded",
  "uploaded_at": "2026-07-01T12:00:00"
}
```

---

## 7. Reviews API

### 7.1 Create Review

```http
POST /reviews
```

Required role:

```text
admin, reader
```

Request:

```json
{
  "image_id": "uuid",
  "label": "simple_cyst",
  "confidence": 4,
  "comment": "Well-defined cystic lesion"
}
```

Response:

```json
{
  "id": "uuid",
  "image_id": "uuid",
  "reader_id": "uuid",
  "label": "simple_cyst",
  "confidence": 4,
  "created_at": "2026-07-01T12:00:00"
}
```

---

### 7.2 List Reviews for Image

```http
GET /images/{image_id}/reviews
```

Required role:

```text
admin, researcher
```

Note:

Readers should not see other readers' labels before submitting their own review.

---

## 8. Consensus API

### 8.1 Create Consensus Label

```http
POST /consensus
```

Required role:

```text
admin
```

Request:

```json
{
  "image_id": "uuid",
  "final_label": "simple_cyst",
  "consensus_method": "auto_agreement",
  "agreement_status": "agreed",
  "comment": "All reviewers agreed"
}
```

Response:

```json
{
  "id": "uuid",
  "image_id": "uuid",
  "final_label": "simple_cyst",
  "consensus_method": "auto_agreement",
  "agreement_status": "agreed",
  "finalized_at": "2026-07-01T12:00:00"
}
```

---

### 8.2 Get Consensus Label

```http
GET /images/{image_id}/consensus
```

Required role:

```text
admin, researcher
```

---

## 9. Dataset API

### 9.1 Export Dataset

```http
POST /datasets/export
```

Required role:

```text
admin, researcher
```

Request:

```json
{
  "project_id": "uuid",
  "export_name": "thyroid_dataset_v0_1",
  "label_schema": "thyroid_phase1_6class"
}
```

Response:

```json
{
  "id": "uuid",
  "export_name": "thyroid_dataset_v0_1",
  "export_path": "datasets/thyroid_dataset_v0_1/",
  "image_count": 1250,
  "created_at": "2026-07-01T12:00:00"
}
```

---

## 10. Initial Label Schema

Phase 1 thyroid ultrasound labels:

```text
normal
simple_cyst
cystic_nodule
solid_nodule
suspicious_malignancy
poor_quality
```

---

## 11. Image Status Flow

```text
uploaded
   ↓
assigned
   ↓
reviewed
   ↓
consensus_pending
   ↓
consensus_completed
   ↓
dataset_included
```

---

## 12. Role-Based Access Control

| API Area | Admin | Reader | Uploader | Researcher |
|---|---|---|---|---|
| Users | yes | no | no | no |
| Projects | yes | read | read | read |
| Image upload | yes | no | yes | no |
| Image review | yes | yes | no | no |
| Consensus | yes | no | no | read |
| Dataset export | yes | no | no | yes |
| AI model development | yes | no | no | yes |

---

## 13. Future API Areas

Future versions may include:

```text
/api/v1/ai-models
/api/v1/predictions
/api/v1/clinical-validation
/api/v1/reports
/api/v1/rag-documents
/api/v1/model-updates
```

---

## 14. Design Principle

The KMAI API is designed to support a human-in-the-loop medical AI workflow.

```text
Image Upload
    ↓
Expert Review
    ↓
Consensus Label
    ↓
Verified Dataset
    ↓
AI Training
    ↓
Clinical Validation
```

The API should never treat unverified user input as a final clinical label.
