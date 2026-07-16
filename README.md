# KMAI

KMAI (Korean Medicine Artificial Intelligence) is a privacy-oriented medical image repository, annotation, structured reading, reporting, and AI-assisted interpretation platform.

The current implementation focuses on thyroid ultrasound imaging and is designed for future expansion to other ultrasound regions and medical imaging modalities.

---

## Current Version

```text
KMAI v0.9
```

Current status:

- Medical image repository implemented
- Rectangle annotation implemented
- Annotation update and deletion implemented
- Image zoom and pan implemented
- Annotated PNG export implemented
- Annotation JSON export implemented
- Polygon-ready backend under development
- Lesion-centered reading workflow planned

---

## Core Workflow

```text
Create Project
      ↓
Upload De-identified Medical Image
      ↓
Open Image Viewer
      ↓
Create Annotation
      ↓
Review or Update Annotation
      ↓
Download Original Image
      ↓
Download Annotated Image or JSON
```

Future workflow:

```text
Select Medical Image
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
Generate Final Report
```

---

## Main Features

### Authentication

- JWT-based login
- Protected API routes
- Current user endpoint
- User listing

### Project Management

- Create project
- List projects
- Organize images by project
- Store modality and body region

### Medical Image Repository

- Upload de-identified medical images
- Generate anonymous Image UID
- Generate SHA-256 hash
- Store image metadata
- Generate thumbnails
- Browse images by project

Supported initial formats:

- JPG
- JPEG
- PNG
- TIFF
- TIF
- BMP
- DICOM

### Image Viewer

- Large image preview
- Zoom
- Pan
- Reset
- Full-screen mode
- Metadata display
- Original image download

### Annotation

- Rectangle annotation
- Normalized coordinates
- Annotation label
- Annotation comment
- Annotation update
- Annotation deletion
- Annotation list
- Selected annotation highlighting

### Download Center

- Original image
- Annotated PNG
- Annotation JSON

---

## Privacy

KMAI follows privacy-by-design principles.

The standard medical image upload form must not collect direct patient identifiers.

The following fields are prohibited:

- Patient ID
- Patient name
- Date of birth
- Resident registration number
- Hospital registration number
- Phone number
- Address

Each medical image is identified by a system-generated anonymous Image UID.

Example:

```text
KMAI-US-THY-2026-84D6B9BE
```

DICOM uploads will require metadata inspection and de-identification before clinical deployment.

---

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic
- Uvicorn

### Database

- PostgreSQL

### Infrastructure

- Docker
- Nginx
- GitHub
- Linux VPS

---

## Repository Structure

```text
kmai/
├── backend/
│   └── app/
│       ├── api/
│       ├── core/
│       ├── models/
│       ├── schemas/
│       └── services/
│
├── frontend/
│   ├── app/
│   ├── components/
│   └── services/
│
├── docs/
│   ├── 01_KMAI_System_Architecture.md
│   ├── 02_KMAI_Database_ERD.md
│   ├── 03_KMAI_UI_Wireframe.md
│   ├── 04_KMAI_API_Specification.md
│   └── 05_KMAI_Product_Roadmap.md
│
├── README.md
└── CHANGELOG.md
```

---

## Documentation

- [01. System Architecture](docs/01_KMAI_System_Architecture.md)
- [02. Database ERD](docs/02_KMAI_Database_ERD.md)
- [03. UI Wireframe](docs/03_KMAI_UI_Wireframe.md)
- [04. API Specification](docs/04_KMAI_API_Specification.md)
- [05. Product Roadmap](docs/05_KMAI_Product_Roadmap.md)
- [Changelog](CHANGELOG.md)

---

## API

Production API base URL:

```text
https://ai.hantopic.kr/api/v1
```

Swagger documentation:

```text
https://ai.hantopic.kr/docs
```

Development backend:

```text
http://127.0.0.1:8010
```

Development frontend:

```text
http://114.207.245.126:3000
```

---

## Current API Endpoints

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

---

## Local Development

### Backend syntax check

```bash
cd /opt/kmai
python3 -m compileall backend/app
```

### Frontend lint

```bash
cd /opt/kmai/frontend
npm run lint
```

### Frontend development server

```bash
cd /opt/kmai/frontend
npm run dev -- --hostname 0.0.0.0
```

### Backend logs

```bash
docker logs --tail 50 kmai-backend
```

---

## Deployment Overview

```text
User Browser
      ↓
Nginx
      ├── Frontend
      └── FastAPI Backend
              ↓
          PostgreSQL
              ↓
          Upload Storage
```

Current backend port mapping:

```text
127.0.0.1:8010 → container:8000
```

---

## Product Roadmap

### KMAI v1.0

- Lesion Manager
- Structured thyroid reading
- TI-RADS calculation
- Multiple lesions per image
- PDF report
- Word report

### KMAI v1.5

- AI-assisted draft findings
- AI-assisted impression
- AI-assisted recommendation
- AI annotation suggestion
- Human approval workflow

### KMAI v2.0

- DICOM de-identification
- Multi-frame DICOM
- Cine loop
- DICOM measurement calibration
- PACS and DICOMweb preparation

### KMAI v3.0

- Multi-organ ultrasound
- CT
- MRI
- X-ray
- Pathology
- Multimodal clinical AI

---

## Development Principles

- Privacy by design
- Human-reviewed AI output
- Lesion-centered architecture
- Modular frontend and backend
- Documentation-first development
- Incremental implementation
- Testing before deployment
- Git-based version control
- Reproducible research workflow

---

## Project Status

Implemented:

- Authentication
- Project management
- Medical image upload
- Medical image repository
- Thumbnail gallery
- Image viewer
- Zoom and pan
- Rectangle annotation
- Annotation update
- Annotation deletion
- Original image download
- Annotated PNG export
- Annotation JSON export

In development:

- Polygon annotation
- Structured label system
- Lesion Manager
- TI-RADS panel
- Structured report

Planned:

- PDF and Word reports
- AI-assisted report drafting
- DICOM de-identification
- PACS integration
- Multi-organ support
- Multimodal medical AI