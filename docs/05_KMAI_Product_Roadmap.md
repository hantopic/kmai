# KMAI Product Roadmap

Document ID: KMAI-ROADMAP-001  
Version: 0.1.0  
Status: Draft  
Platform: KMAI Medical Image Reading Platform  
Last Updated: July 2026

---

## 1. Purpose

This document defines the product development roadmap of the KMAI platform.

KMAI is being developed as a privacy-oriented medical image repository, annotation, structured reading, reporting, and AI-assisted interpretation platform.

The initial clinical and research application focuses on thyroid ultrasound imaging.

The platform will later be expanded to additional ultrasound regions and other medical imaging modalities.

---

## 2. Product Vision

KMAI aims to provide an integrated workflow for:

- Medical image upload
- Image review
- Lesion annotation
- Lesion-centered structured interpretation
- TI-RADS assessment
- Findings, impression, and recommendation entry
- Annotated image export
- Structured data export
- Report generation
- AI-assisted interpretation

The final interpretation must remain under the control of an authorized human reader.

---

## 3. Core Workflow

```text
Create Project
      ↓
Upload De-identified Medical Image
      ↓
Open Reading Workspace
      ↓
Review Image
      ↓
Create or Select Lesion
      ↓
Draw Annotation
      ↓
Enter Structured Findings
      ↓
Calculate Assessment Category
      ↓
Write Findings
      ↓
Write Impression
      ↓
Write Recommendation
      ↓
Save Final Reading
      ↓
Export Image, Data, or Report

## 4. Product Development Principles

KMAI development follows these principles:

Privacy by design
No direct patient identifiers in the upload interface
Lesion-centered data architecture
Modular frontend and backend structure
Human-reviewed AI output
Incremental feature development
Testing before deployment
Git-based version control
Documentation-first design
Research reproducibility

## 5. Current Release Status

KMAI v0.9

Status: Implemented

Core functions:

JWT authentication
User login
Dashboard
Project management
Medical image upload
Anonymous Image UID generation
SHA-256 file integrity hash
Thumbnail generation
Medical Image Repository
Project-based image browsing
Image Viewer
Zoom
Pan
Full-screen mode
Metadata panel
Rectangle annotation
Annotation creation
Annotation update
Annotation deletion
Original image download
Annotated PNG download
Annotation JSON export

Supported image formats:

JPG
JPEG
PNG
TIFF
TIF
BMP
DICOM

## 6. KMAI v1.0

Target: Stable Thyroid Ultrasound Reading Platform

### 6.1 Lesion Manager

Planned functions:

Add lesion
Select lesion
Rename lesion
Delete lesion
Assign lesion number
Link annotations to lesions
Display lesion summary
Highlight the selected lesion
Support multiple lesions per image

Example:

Lesion 1
Right lobe
12.3 mm
TR4

Lesion 2
Simple cyst
7.2 mm
TR2

### 6.2 Structured Label System

Planned fields:

Lesion type
Lobe
Region
Composition
Echogenicity
Shape
Margin
Echogenic foci
Size
TI-RADS score
TI-RADS category

### 6.3 Structured Reading

Planned report sections:

Findings
Impression
Recommendation
Reader
Reading status
Created date
Updated date

### 6.4 Annotation Improvements

Planned functions:

Polygon annotation
Annotation color by lesion type
Annotation visibility toggle
Annotation editing
Annotation movement
Annotation resizing
Annotation history
Undo and redo

### 6.5 Report Export

Planned formats:

PDF report
Word report
Annotated image
Structured JSON

## 7. KMAI v1.1

Target: Advanced Reading and Measurement

Planned functions:

Long-axis measurement
Short-axis measurement
AP measurement
Automatic volume calculation
Manual calibration
DICOM Pixel Spacing support
Measurement overlays
Measurement editing
Multiple image comparison
Split-screen viewing
Previous examination comparison

Volume calculation may use:

Volume = Length × Width × Depth × 0.523

## 8. KMAI v1.5

Target: AI-Assisted Reading

Planned functions:

Lesion candidate suggestion
Automatic rectangle suggestion
Segmentation suggestion
TI-RADS suggestion
Findings draft generation
Impression draft generation
Recommendation draft generation
Accept, modify, or reject AI output
AI model version tracking
AI confidence display
Human approval workflow

AI results must be labeled as draft suggestions.

Image
  ↓
AI Suggestion
  ↓
Reader Review
  ↓
Accept / Modify / Reject
  ↓
Final Approved Reading

## 9. KMAI v2.0

Target: DICOM and Clinical Integration

Planned functions:

DICOM image upload
DICOM metadata extraction
Automatic DICOM de-identification
Multi-frame DICOM support
Cine loop playback
Window and level adjustment
DICOM measurement calibration
DICOM export
PACS connection preparation
DICOMweb support
Institutional authentication
Clinical audit logging

Potential standards:

DICOM
DICOMweb
FHIR
HL7
OAuth 2.0
OpenID Connect

## 10. KMAI v2.5

Target: Multi-Organ Ultrasound Platform

Planned modules:

Thyroid ultrasound
Carotid ultrasound
Abdominal ultrasound
Liver ultrasound
Gallbladder ultrasound
Kidney ultrasound
Breast ultrasound
Shoulder ultrasound
Knee ultrasound
Musculoskeletal ultrasound

Each organ module should use a shared platform architecture with organ-specific structured reading fields.

## 11. KMAI v3.0

Target: Multimodal Medical AI Platform

Planned modalities:

Ultrasound
CT
MRI
X-ray
Pathology
Clinical records
Laboratory data
Genomic data
Natural product and traditional medicine data

Potential workflow

Medical Image
+
Clinical Data
+
Laboratory Data
+
Omics Data
      ↓
Multimodal Foundation Model
      ↓
Clinical Decision Support
      ↓
Structured Report

## 12. Development Sprint Plan

Sprint 1 — Authentication

Status: Completed

JWT login
Protected APIs
Admin account
User authentication

Sprint 2 — Project Management

Status: Completed

Project creation
Project list
Project-based image organization

Sprint 3 — Medical Image Repository

Status: Completed

Upload API
File validation
Image UID
Metadata storage
Thumbnail generation

Sprint 4 — Image Gallery

Status: Completed

Thumbnail Gallery
Project filtering
Image selection

Sprint 5 — Image Viewer

Status: Completed

Large image preview
Zoom
Pan
Full screen
Metadata

Sprint 6 — Annotation

Status: Completed

Rectangle drawing
Coordinate normalization
Database storage
Update
Delete

Sprint 7 — Download Center

Status: Completed

Original image
Annotated PNG
Annotation JSON

Sprint 8 — Annotation Refactoring

Status: Completed

Annotation Toolbar
Annotation List
Download Center component
Modular frontend structure

Sprint 9 — Lesion Manager

Status: Planned

Lesion model
Lesion API
Lesion list
Annotation-to-lesion connection
Multiple lesion support

Sprint 10 — Structured Reading

Status: Planned

Thyroid feature form
TI-RADS data entry
TI-RADS calculation
Findings
Impression
Recommendation

Sprint 11 — Advanced Annotation

Status: Planned

Polygon
Resize
Move
Undo
Redo
Label colors

Sprint 12 — Report Generation

Status: Planned

PDF report
Word report
Report preview
Final approval

Sprint 13 — AI Assistance

Status: Planned

Detection suggestion
Segmentation suggestion
Draft report
User approval

Sprint 14 — DICOM

Status: Planned

De-identification
Metadata
Multi-frame viewer
Cine playback

Sprint 15 — PACS and Interoperability

Status: Planned

DICOMweb
PACS browser
FHIR preparation
Institutional integration

## 13. Development Priority

Priority 1:

Stable image repository
Secure authentication
Reliable annotation storage
Annotation delete and update
Download and export

Priority 2:

Lesion Manager
Structured reporting
TI-RADS
PDF report

Priority 3:

Polygon
Measurements
DICOM
AI suggestion

Priority 4:

PACS
Multi-organ support
Multimodal AI
Clinical system integration

## 14. Release Management

Recommended release branches:

main
develop
feature/*
release/*
hotfix/*

Example:

feature/lesion-manager
feature/structured-report
feature/polygon
feature/tirads
feature/pdf-report
feature/dicom-viewer
feature/ai-assistant

Release tags:

v0.9.0
v1.0.0
v1.1.0
v1.5.0
v2.0.0

15. Testing Strategy

Each release should include:

Backend compile test
Frontend lint test
Frontend production build
API test
Authentication test
Database migration test
Upload test
Annotation test
Download test
Browser test
Mobile browser test
Regression test

Recommended commands:

python3 -m compileall backend/app

cd frontend
npm run lint
npm run build

## 16. Security Milestones

Required before clinical deployment:

HTTPS-only access
Strong password policy
Role-based access control
Secure token storage
Token expiration
Audit logs
Upload size limits
File content validation
DICOM de-identification
Encrypted backups
Restricted file access
Protected image download
Database backup policy
Disaster recovery plan

## 17. Privacy Milestones

KMAI must not collect direct patient identifiers in the standard upload workflow.

Prohibited upload fields:

Patient ID
Patient name
Date of birth
Registration number
Phone number
Address

Required privacy functions:

Anonymous Image UID
DICOM metadata inspection
DICOM de-identification
Audit history
Access control
Secure deletion
Data retention policy

## 18. Documentation Roadmap

Current documents:

01_KMAI_System_Architecture.md
02_KMAI_Database_ERD.md
03_KMAI_UI_Wireframe.md
04_KMAI_API_Specification.md
05_KMAI_Product_Roadmap.md

Planned documents:

06_KMAI_AI_Architecture.md
07_KMAI_Deployment_Guide.md
08_KMAI_User_Manual.md
09_KMAI_Developer_Guide.md
CHANGELOG.md
README.md

## 19. Success Criteria for KMAI v1.0

KMAI v1.0 will be considered complete when:

Users can securely log in.
Users can create projects.
Users can upload de-identified medical images.
Images receive anonymous Image UIDs.
Users can browse images by project.
Users can view, zoom, and pan images.
Users can create and manage multiple lesions.
Users can create and edit annotations.
Users can enter structured thyroid findings.
TI-RADS categories can be calculated.
Findings, impression, and recommendation can be stored.
Annotated images can be downloaded.
Structured JSON can be exported.
PDF reports can be generated.
All core workflows pass testing.

## 20. Long-Term Vision

KMAI will evolve from a thyroid ultrasound reading platform into a multimodal medical artificial intelligence platform.

Medical Image Repository
        ↓
Reading Workspace
        ↓
Lesion-Centered Annotation
        ↓
Structured Interpretation
        ↓
AI-Assisted Draft
        ↓
Human Approval
        ↓
Clinical Report
        ↓
Research Dataset

The platform should support both medical research and professionally supervised clinical interpretation while maintaining privacy, transparency, traceability, and human oversight.
