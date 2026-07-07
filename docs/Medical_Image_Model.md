# KMAI Medical Image Model

**Document ID:** KMAI-IMG-001  
**Version:** 0.1.0  
**Status:** Phase 1 – Thyroid Ultrasound Image Repository  
**Last Updated:** July 2026  
**Project:** KMAI (Korean Medicine Artificial Intelligence Platform)

---

## 1. Overview

This document defines the medical image data model for the KMAI Platform.

The initial implementation focuses on thyroid ultrasound images, but the model is designed to support multiple medical imaging modalities in the future.

Supported modalities may include:

- Ultrasound
- CT
- MRI
- X-ray
- Tongue images
- Endoscopy images
- Pathology images

---

## 2. Supported File Formats

KMAI Medical Image Repository will support the following formats:

- JPG
- JPEG
- PNG
- TIFF
- TIF
- BMP
- DICOM (`.dcm`)

Future optional formats:

- MP4
- AVI

---

## 3. Privacy by Design

KMAI must not collect personally identifiable patient information during image upload.

The following fields must not be collected:

- Patient ID
- Patient name
- Resident registration number
- Date of birth
- Phone number
- Address
- Hospital registration number

Instead, the system automatically generates an anonymous image identifier.

Example:

```text
KMAI-IMG-202600000001
