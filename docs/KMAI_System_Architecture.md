# KMAI System Architecture

Document ID: KMAI-ARCH-001  
Version: 0.2.0  
Status: Draft  
Platform: KMAI Medical Image Reading Platform  
Primary Module: Thyroid Ultrasound Reading  
Last Updated: July 2026

---

## 1. Purpose

This document defines the system architecture of the KMAI platform.

KMAI is designed as a privacy-oriented medical image reading, annotation, structured reporting, and AI-assisted research platform.

The initial implementation focuses on thyroid ultrasound imaging. The architecture should also support future expansion to carotid, abdominal, musculoskeletal, breast, liver, kidney, CT, MRI, X-ray, and pathology imaging.

---

## 2. Core Design Principles

### 2.1 Privacy by Design

KMAI does not collect direct patient identifiers during medical image upload.

The following information must not be collected through the upload interface:

- Patient ID
- Patient name
- Resident registration number
- Date of birth
- Phone number
- Address
- Hospital registration number

Each image is identified using a system-generated anonymous Image UID.

Example:

```text
KMAI-US-THY-2026-84D6B9BE

### 2.2 Lesion-Centered Reading

The primary reading unit is a lesion rather than an annotation shape.

A lesion may contain:

Rectangle annotations
Polygon annotations
Location information
Size measurements
Structured ultrasound findings
TI-RADS assessment
Findings
Impression
Recommendation

### 2.3 Modular Architecture

The platform is divided into independent modules:

Authentication
Project management
Medical image repository
Image viewer
Annotation
Lesion management
Structured reporting
Report export
Dataset export
AI assistance

### 2.4 Human-Controlled Clinical Workflow

AI-generated results are considered draft suggestions.

Final clinical or research interpretation must be reviewed and approved by an authorized user.

## 3. High-Level Architecture

User Browser
    │
    ▼
Next.js Frontend
    │
    ├── Login
    ├── Dashboard
    ├── Projects
    ├── Image Repository
    ├── Reading Workspace
    ├── Annotation Tools
    ├── Structured Reporting
    └── Download Center
    │
    ▼
Nginx Reverse Proxy
    │
    ├── /              → Next.js Frontend
    ├── /api/v1        → FastAPI Backend
    ├── /docs          → FastAPI Swagger
    └── /uploads       → Medical Image Storage
    │
    ▼
FastAPI Backend
    │
    ├── Authentication API
    ├── Project API
    ├── Medical Image API
    ├── Annotation API
    ├── Lesion API
    ├── Structured Report API
    ├── Export API
    └── AI Assistance API
    │
    ├── PostgreSQL
    └── File Storage

    ## 4. Deployment Architecture

    Internet
   │
   ▼
ai.hantopic.kr
   │
   ▼
Nginx
   │
   ├── Frontend Service
   │      Next.js
   │      Port 3000
   │
   └── Backend Service
          FastAPI
          Host Port 8010
          Container Port 8000
              │
              ├── PostgreSQL
              └── Upload Storage

## 5. Frontend Architecture

The frontend is implemented with Next.js and TypeScript.

Recommended component structure:

frontend/
├── app/
│   ├── dashboard/
│   ├── projects/
│   ├── images/
│   ├── reading/
│   └── reports/
│
├── components/
│   ├── image/
│   │   ├── ImageViewer.tsx
│   │   ├── ThumbnailGallery.tsx
│   │   └── ImageMetadataPanel.tsx
│   │
│   ├── annotation/
│   │   ├── AnnotationCanvas.tsx
│   │   ├── AnnotationToolbar.tsx
│   │   ├── AnnotationList.tsx
│   │   ├── DownloadCenter.tsx
│   │   └── annotationLabels.ts
│   │
│   ├── lesion/
│   │   ├── LesionManager.tsx
│   │   ├── LesionForm.tsx
│   │   └── TiradsPanel.tsx
│   │
│   ├── report/
│   │   ├── StructuredReportForm.tsx
│   │   ├── FindingsEditor.tsx
│   │   └── ReportPreview.tsx
│   │
│   └── common/
│
├── services/
│   └── api.ts
│
├── types/
├── hooks/
└── lib/

## 6. Backend Architecture

The backend is implemented with FastAPI and SQLAlchemy.

Recommended structure:

backend/app/
├── api/v1/
│   ├── auth.py
│   ├── users.py
│   ├── projects.py
│   ├── medical_images.py
│   ├── annotations.py
│   ├── lesions.py
│   ├── reports.py
│   └── exports.py
│
├── models/
│   ├── user.py
│   ├── project.py
│   ├── medical_image.py
│   ├── annotation.py
│   ├── lesion.py
│   └── report.py
│
├── schemas/
│   ├── annotation.py
│   ├── lesion.py
│   └── report.py
│
├── services/
│   ├── medical_image_service.py
│   ├── annotation_service.py
│   ├── tirads_service.py
│   ├── report_service.py
│   └── export_service.py
│
├── core/
│   ├── database.py
│   ├── security.py
│   └── configuration.py
│
└── main.py

## 7. Core Domain Model

User
  │
  ├── creates Project
  │
  ├── uploads Medical Image
  │
  ├── creates Lesion
  │
  ├── creates Annotation
  │
  └── creates Reading Report

Project
  │
  └── contains Medical Images

Medical Image
  │
  ├── contains Lesions
  │
  ├── contains Annotations
  │
  └── contains Reports

Lesion
  │
  ├── has one or more Annotations
  │
  ├── has Structured Findings
  │
  ├── has TI-RADS assessment
  │
  └── contributes to Reading Report

  ## 8. Medical Image Workflow

  Create Project
      ↓
Upload Medical Image
      ↓
Validate File Format
      ↓
Generate Anonymous Image UID
      ↓
Store Original File
      ↓
Generate Thumbnail
      ↓
Calculate SHA-256 Hash
      ↓
Save Metadata
      ↓
Open Reading Workspace

Supported initial formats:

JPG
JPEG
PNG
TIFF
TIF
BMP
DICOM

Future optional formats:

MP4
AVI

## 9. Reading Workflow

Select Project
      ↓
Select Medical Image
      ↓
Open Reading Workspace
      ↓
Review Image
      ↓
Create or Select Lesion
      ↓
Draw Rectangle or Polygon
      ↓
Enter Structured Findings
      ↓
Calculate TI-RADS
      ↓
Write Findings
      ↓
Write Impression
      ↓
Write Recommendation
      ↓
Save Reading
      ↓
Generate Report or Export Data

## 10. Annotation Architecture

Annotation coordinates are stored in normalized values between 0.0 and 1.0.

This ensures that annotations remain aligned with the image regardless of:

Viewer size
Browser resolution
Zoom level
Original image resolution

Rectangle example:

{
  "annotation_type": "rectangle",
  "x": 0.25,
  "y": 0.30,
  "width": 0.20,
  "height": 0.18
}

Annotations must not contain direct patient identifiers.

## 11. Lesion-Centered Data Architecture

Each lesion is linked to a medical image.

A lesion may include:

Lesion UID
Image ID
Lesion Number
Lesion Type
Lobe
Region
Long-axis Size
Short-axis Size
AP Size
Composition
Echogenicity
Shape
Margin
Echogenic Foci
TI-RADS Score
TI-RADS Category
Findings
Impression
Recommendation
Created By
Created At
Updated At

An image may contain multiple lesions.

Medical Image
├── Lesion 1
├── Lesion 2
└── Lesion 3

## 12. Structured Reporting Architecture

The structured report is composed of three levels.

Image Level
Modality
Body region
View plane
Side
Image quality

Lesion Level
Location
Size
Composition
Echogenicity
Shape
Margin
Echogenic foci
TI-RADS

Report Level
Findings
Impression
Recommendation
Report status
Reviewer
Approval timestamp

## 13. Download and Export Architecture

KMAI provides three primary image-level downloads:

Original Image
Annotated Image
Annotation JSON

Future report and dataset exports:

PDF Report
Word Report
YOLO Dataset
COCO Dataset
LabelMe JSON
DICOM-compatible Export

Project-level bulk export should support ZIP packaging.

## 14. AI Assistance Architecture

Future AI functions may include:

Lesion candidate detection
Automatic segmentation
TI-RADS suggestion
Findings draft generation
Impression draft generation
Recommendation draft generation

AI output must be clearly identified as a suggestion.

Medical Image
      ↓
AI Analysis
      ↓
Draft Suggestion
      ↓
User Review
      ↓
Accept / Modify / Reject
      ↓
Final Approved Reading

## 15. Security Architecture

Required security controls:

JWT-based authentication
Role-based authorization
HTTPS access
Upload file validation
File size limitation
MIME-type verification
SHA-256 integrity checking
Audit logging
Protected download endpoints
Restricted delete permissions

Recommended user roles:

Admin
Reader
Reviewer
Researcher
Viewer

## 16. DICOM Privacy Architecture

DICOM files may include embedded personally identifiable information.

The DICOM upload pipeline should include:

DICOM Upload
      ↓
Metadata Inspection
      ↓
De-identification
      ↓
Removal or Replacement of Sensitive Tags
      ↓
Technical Metadata Extraction
      ↓
Thumbnail Generation
      ↓
Secure Storage

Sensitive DICOM tags should not be retained unless explicitly authorized and required.

## 17. Scalability

The current local file-storage structure may later be replaced with object storage.

Initial:

Local Volume Storage

Future:

S3-Compatible Object Storage
MinIO
AWS S3
Institutional Storage

PostgreSQL remains the primary metadata database.

## 18. Future Expansion

The architecture should support the following modules without major redesign:

Thyroid ultrasound
Carotid ultrasound
Abdominal ultrasound
Shoulder ultrasound
Musculoskeletal ultrasound
Breast ultrasound
Liver ultrasound
Kidney ultrasound
CT
MRI
X-ray
Pathology imaging
Multimodal clinical AI

19. Current Implementation Status

Completed:

JWT authentication
Project management
Medical image upload
Image UID generation
SHA-256 generation
Thumbnail creation
Medical image repository
Image viewer
Zoom and pan
Full-screen view
Rectangle annotation
Annotation update
Annotation deletion
Original image download
Annotated PNG download
Annotation JSON export

In development:

Polygon annotation
Structured label system
Lesion Manager
TI-RADS panel
Structured reading report

Planned:

PDF and Word reports
Dataset export
AI draft generation
DICOM de-identification
PACS integration

