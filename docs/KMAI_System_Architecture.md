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