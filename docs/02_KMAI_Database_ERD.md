# KMAI Database ERD

Document ID: KMAI-DB-001  
Version: 0.1.0  
Status: Draft  
Platform: KMAI Medical Image Reading Platform

---

# 1. Purpose

This document defines the logical database architecture of KMAI.

The database is designed around a lesion-centered reading workflow rather than an annotation-centered workflow.

Each uploaded medical image may contain multiple lesions.

Each lesion may contain multiple annotations and one structured report.

---

# 2. Database Overview

```
Users
   │
   ├──────────────┐
   │              │
Projects      Reading Reports
   │
Medical Images
   │
   ├───────────────┐
   │               │
Lesions      Image Metadata
   │
Annotations
```

---

# 3. Entity Relationship Diagram

```
User
 │
 ├───────────────┐
 │               │
Project      Reading Report
 │
Medical Image
 │
 ├───────────────┐
 │               │
Lesion      Annotation
```

---

# 4. Database Tables

The current platform consists of the following core tables.

| Table | Status |
|--------|--------|
| users | Implemented |
| projects | Implemented |
| medical_images | Implemented |
| annotations | Implemented |
| lesions | Planned |
| reports | Planned |
| ai_reports | Planned |

---

# 5. users

Stores authenticated platform users.

Primary Key

```
id
```

Fields

| Field | Type |
|--------|------|
| id | UUID |
| username | String |
| email | String |
| password_hash | String |
| role | String |
| created_at | Timestamp |

---

# 6. projects

Stores annotation projects.

Relationship

```
User

↓

Project
```

Fields

| Field | Type |
|--------|------|
| id | UUID |
| name | String |
| description | Text |
| modality | String |
| body_region | String |
| created_by | UUID |
| created_at | Timestamp |

---

# 7. medical_images

Stores uploaded medical images.

Relationship

```
Project

↓

Medical Image
```

Fields

| Field | Type |
|--------|------|
| id | UUID |
| image_uid | String |
| project_id | UUID |
| modality | String |
| body_region | String |
| original_filename | String |
| storage_path | String |
| sha256_hash | String |
| thumbnail_path | String |
| uploaded_by | UUID |
| uploaded_at | Timestamp |

---

# 8. lesions

Planned

One medical image may contain multiple lesions.

Relationship

```
Medical Image

↓

Lesion
```

Fields

| Field | Type |
|--------|------|
| id | UUID |
| image_id | UUID |
| lesion_number | Integer |
| lesion_type | String |
| lobe | String |
| location | String |
| long_axis_mm | Float |
| short_axis_mm | Float |
| ap_mm | Float |
| tirads_score | Integer |
| tirads_category | String |
| created_by | UUID |
| created_at | Timestamp |

---

# 9. annotations

Relationship

```
Medical Image

↓

Annotation
```

Future

```
Lesion

↓

Annotation
```

Fields

| Field | Type |
|--------|------|
| id | UUID |
| image_id | UUID |
| lesion_id | UUID (future) |
| reviewer_id | UUID |
| annotation_type | rectangle / polygon |
| x | Float |
| y | Float |
| width | Float |
| height | Float |
| points | JSON |
| label | String |
| comment | Text |
| created_at | Timestamp |
| updated_at | Timestamp |

---

# 10. reports

One image has one structured report.

Relationship

```
Medical Image

↓

Reading Report
```

Fields

| Field | Type |
|--------|------|
| id | UUID |
| image_id | UUID |
| findings | Text |
| impression | Text |
| recommendation | Text |
| reviewer | UUID |
| report_status | Draft / Final |
| created_at | Timestamp |

---

# 11. AI Reports

Future

Stores AI-generated draft reports.

Fields

| Field | Type |
|--------|------|
| id | UUID |
| report_id | UUID |
| ai_model | String |
| findings | Text |
| impression | Text |
| recommendation | Text |
| confidence | Float |
| created_at | Timestamp |

---

# 12. Future Relationships

```
User

│

├── Project

│

├── Medical Image

│

├── Lesion

│

├── Annotation

│

├── Reading Report

│

└── AI Report
```

---

# 13. Data Flow

```
Create Project

↓

Upload Image

↓

Generate Image UID

↓

Store Metadata

↓

Create Lesion

↓

Create Annotation

↓

Structured Report

↓

AI Draft

↓

Final Report

↓

Export
```

---

# 14. Index Strategy

Recommended indexes

```
users.username

projects.created_by

medical_images.project_id

medical_images.image_uid

annotations.image_id

annotations.reviewer_id

lesions.image_id

reports.image_id
```

---

# 15. Privacy

The following data shall NOT be stored.

- Patient Name

- Patient ID

- Resident Registration Number

- Phone Number

- Address

Images shall be referenced only by

```
Image UID
```

Example

```
KMAI-US-THY-2026-84D6B9BE
```

---

# 16. Planned Expansion

The database architecture supports

- Thyroid Ultrasound

- Carotid Ultrasound

- Shoulder Ultrasound

- Abdominal Ultrasound

- Breast Ultrasound

- Liver Ultrasound

- Kidney Ultrasound

- CT

- MRI

- Pathology

without redesign.

---

# 17. Current Implementation Status

Implemented

✔ Users

✔ Projects

✔ Medical Images

✔ Rectangle Annotation

✔ Polygon-ready Annotation

Planned

□ Lesions

□ Structured Report

□ AI Report

□ DICOM Metadata

□ PACS Integration