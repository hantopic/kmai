# KMAI Database ERD

**Document ID:** KMAI-DB-001  
**Version:** 0.1.0  
**Status:** Phase 1 – Thyroid Ultrasound Consensus Platform  
**Last Updated:** July 2026  
**Project:** KMAI (Korean Medicine Artificial Intelligence Platform)

---

## 1. Overview

This document defines the initial database structure of the KMAI Platform.

The database is designed to support:

- User management
- Project and module management
- Medical image metadata storage
- Expert review records
- Consensus labeling
- Dataset export for AI training
- Future clinical validation and AI model management

The initial implementation focuses on thyroid ultrasound images, but the schema is designed to support future expansion to other clinical domains.

---

## 2. Core Entity Relationship

```text
users
  │
  ├── uploads images
  │
  ├── creates reviews
  │
  └── finalizes consensus labels

projects
  │
  └── images
        │
        ├── reviews
        │
        ├── consensus_labels
        │
        └── dataset_exports
