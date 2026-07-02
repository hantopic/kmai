# KMAI Platform Architecture

**Document ID:** KMAI-ARCH-001
**Version:** 0.1.0  
**Status:** Phase 1 – Thyroid Ultrasound Consensus Platform  
**Last Updated:** July 2026

---

## 1. Overview

KMAI Platform is a modular, web-based, multimodal AI platform for Korean Medicine.

The platform is designed to support:

- Medical image repository construction
- Expert consensus labeling
- AI training dataset generation
- Clinical validation
- AI-assisted report generation
- Korean Medicine knowledge retrieval
- Future precision medicine applications

The initial version focuses on thyroid ultrasound images, but the architecture is designed to expand to carotid ultrasound, abdominal ultrasound, shoulder ultrasound, musculoskeletal ultrasound, tongue images, voice data, RAG, and multimodal AI models.

---

## 2. Architecture Philosophy

KMAI Platform is designed based on four fundamental principles.

### 1. Modular Design

Every clinical domain (thyroid, carotid, abdomen, shoulder, tongue, voice, etc.) is implemented as an independent module while sharing a common platform architecture.

### 2. Human-in-the-loop AI

KMAI prioritizes expert knowledge over automated decision-making.

Rather than allowing AI to generate labels directly, expert clinicians independently review medical images and establish consensus labels. These verified labels become the foundation for AI model training.

### 3. Clinical Validation First

The primary objective is not to develop AI models rapidly, but to establish clinically validated, high-quality datasets that can support reliable AI development.

### 4. Continuous Learning

KMAI is designed as a continuously evolving platform.

As new expert-reviewed cases accumulate, datasets are expanded, AI models are retrained, and system performance is continuously improved.


## 3. System Architecture

```text
                         KMAI Platform
           Korean Medicine Artificial Intelligence Platform

              PC / Tablet / Mobile Browser
                         │
                         ▼
               Progressive Web App
                         │
                         ▼
                 Next.js Frontend
                         │
                    REST API
                         │
                         ▼
                 FastAPI Backend
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
 Authentication     PostgreSQL       Image Storage
   JWT / RBAC       Metadata DB      Local / Object
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                  Core Module Layer
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
 Image Repository  Consensus Labeling  Dataset Builder
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                  AI Module Layer
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   AI Training    Clinical Validation   RAG Knowledge
                         │
                         ▼
                 Report Generator
                         │
                         ▼
                  Model Update
```

---

## 4. Core Design Principles

### 3.1 Modular Architecture

KMAI is designed as a modular platform.

Each clinical domain can be implemented as a module:

- Thyroid Ultrasound Module
- Carotid Ultrasound Module
- Abdominal Ultrasound Module
- Shoulder Ultrasound Module
- Musculoskeletal Ultrasound Module
- Tongue Image Module
- Voice Analysis Module

Each module follows the same general workflow:

```text
Upload
  ↓
Metadata Registration
  ↓
Independent Expert Review
  ↓
Consensus Labeling
  ↓
Dataset Builder
  ↓
AI Training
  ↓
Clinical Validation
  ↓
Report Generation
```

---

## 5. Phase 1 Architecture

Phase 1 focuses on thyroid ultrasound consensus labeling.

```text
Thyroid Ultrasound Image
          │
          ▼
Image Repository
          │
          ▼
Reader A Review
Reader B Review
Reader C Review
          │
          ▼
Consensus Labeling
          │
          ▼
Final Label
          │
          ▼
AI Training Dataset
```

Phase 1 does not aim to provide automated diagnosis.  
Instead, it focuses on building a high-quality expert-labeled dataset.

---

## 6. User Roles

### Admin

- User management
- Project management
- Consensus finalization
- Dataset export
- System monitoring

### Reader

- Independent image review
- Label selection
- Confidence scoring
- Comment entry

### Uploader

- Image upload
- Metadata registration
- Optional clinical information entry

### Researcher

- Dataset review
- Exported dataset access
- Model development support

---

## 7. Data Flow

```text
1. Uploader uploads thyroid ultrasound image
2. System assigns anonymized image ID
3. Image metadata is stored in PostgreSQL
4. Image file is stored in local or object storage
5. Multiple readers independently review the image
6. Review results are stored separately
7. Consensus label is generated or finalized
8. Verified data are exported for AI training
9. Future AI models are trained and validated
```

---

## 8. Technology Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Progressive Web App

### Backend

- FastAPI
- Python
- SQLAlchemy
- Alembic
- JWT Authentication

### Database

- PostgreSQL

### Storage

- Local file storage in early development
- S3-compatible object storage in later deployment

### Deployment

- Docker
- Docker Compose
- Nginx
- HTTPS with Let’s Encrypt

### AI Layer

- PyTorch
- MedGemma integration
- Ultrasound-specific image models
- RAG with vector database in future phases

---

## 9. Database Architecture Summary

The initial database structure includes:

```text
users
projects
images
reviews
consensus_labels
dataset_exports
```

Future versions may include:

```text
patients_anonymous
studies
series
ai_models
model_predictions
clinical_validation
reports
rag_documents
```

---

## 10. Security and Privacy Principles

KMAI is designed with medical data protection in mind.

Key principles:

- No identifiable patient information in uploaded images
- Anonymous image ID generation
- Role-based access control
- Secure login
- Separation of image files and metadata
- No patient data stored in GitHub
- No training dataset committed to the repository
- HTTPS-only deployment

---

## 11. Future Expansion

KMAI is designed to evolve into a multimodal Korean Medicine AI platform.

Planned future modules:

- Thyroid ultrasound AI model
- Carotid ultrasound AI model
- Abdominal ultrasound AI model
- Shoulder ultrasound AI model
- Musculoskeletal ultrasound AI model
- Tongue image AI module
- Voice analysis module
- Korean Medicine RAG knowledge base
- MedGemma-based report generator
- Clinical Decision Support System
- Precision medicine prediction engine

---

## 12. Long-Term Vision

The long-term goal of KMAI is to become a Korean Medicine precision medicine AI platform.

The platform will integrate:

- Medical imaging
- Expert consensus labels
- Clinical records
- Korean Medicine diagnosis
- Treatment history
- Outcome data
- AI models
- RAG knowledge systems
- Multimodal foundation models

This architecture allows KMAI to begin with thyroid ultrasound images and gradually expand into a comprehensive multimodal AI platform for Korean Medicine.
