# KMAI UI Wireframe

Document ID: KMAI-UI-001

Version: 0.1.0

Status: Draft

Platform: KMAI Medical Image Reading Platform

---

# 1. Purpose

This document defines the user interface (UI) design of the KMAI platform.

The interface is designed for efficient medical image interpretation, annotation, structured reporting, and AI-assisted reading.

The first implementation focuses on thyroid ultrasound imaging while maintaining extensibility for future imaging modalities.

---

# 2. Design Principles

The KMAI user interface follows these principles.

- Simple
- Fast
- Minimal Clicks
- Large Image Area
- Reading-first Workflow
- Responsive Layout
- AI-assisted (not AI-controlled)

---

# 3. Main Navigation

```
Dashboard

Projects

Medical Image Repository

Reading Workspace

Reports

Settings

Administration
```

---

# 4. Dashboard

```
+------------------------------------------------------------+

KMAI Dashboard

--------------------------------------------------------------

Projects

Medical Images

Recent Reports

Recent Activities

Storage Usage

--------------------------------------------------------------

[ Open Project ]

[ Upload Images ]

[ Reading Workspace ]

+------------------------------------------------------------+
```

---

# 5. Project List

```
+------------------------------------------------------------+

Projects

--------------------------------------------------------------

Project Name

Body Region

Images

Last Updated

--------------------------------------------------------------

Thyroid Dataset

Shoulder Dataset

Abdominal Dataset

--------------------------------------------------------------

[ Create Project ]

+------------------------------------------------------------+
```

---

# 6. Medical Image Repository

```
+------------------------------------------------------------+

Medical Image Repository

--------------------------------------------------------------

Search

Project

Body Region

Upload Date

--------------------------------------------------------------

Thumbnail

Image UID

Format

Resolution

Reviewer

--------------------------------------------------------------

[ Upload ]

[ View ]

[ Delete ]

+------------------------------------------------------------+
```

---

# 7. Reading Workspace

This is the most important screen of KMAI.

```
+-----------------------------------------------------------------------+

Toolbar

--------------------------------------------------------------------------

 View

 Annotate

 Report

 Download

 Full Screen

--------------------------------------------------------------------------

Image Viewer

-----------------------------------------------------------

               Ultrasound Image

-----------------------------------------------------------

Reading Panel

-----------------------------------------------------------

Lesions

Lesion 1

Lesion 2

+ Add Lesion

-----------------------------------------------------------

Structured Report

-----------------------------------------------------------

Lesion Type

Composition

Echogenicity

Shape

Margin

Echogenic Foci

TI-RADS

-----------------------------------------------------------

Findings

Impression

Recommendation

-----------------------------------------------------------

Save

Generate Report

+-----------------------------------------------------------------------+
```

---

# 8. Image Viewer

The viewer supports

- Zoom
- Pan
- Full Screen
- Rectangle Annotation
- Polygon Annotation
- Annotation Selection
- Annotation Editing
- Metadata Display

Toolbar

```
View

Annotate

Zoom +

Zoom -

Reset

Hide Metadata

Download

Close
```

---

# 9. Lesion Manager

Each medical image may contain multiple lesions.

```
Lesions

--------------------------------

Lesion 1

TR4

--------------------------------

Lesion 2

Simple Cyst

--------------------------------

Lesion 3

TR3

--------------------------------

+ Add Lesion
```

Selecting a lesion highlights all associated annotations.

---

# 10. Structured Reporting Panel

```
Lesion Type

▼ Nodule

--------------------------------

Location

▼ Right Lobe

▼ Upper Pole

--------------------------------

Composition

▼ Solid

--------------------------------

Echogenicity

▼ Hypoechoic

--------------------------------

Shape

▼ Wider-than-tall

--------------------------------

Margin

▼ Smooth

--------------------------------

Echogenic Foci

▼ None

--------------------------------

TI-RADS

TR4
```

---

# 11. Findings Editor

```
Findings

__________________________________

__________________________________

__________________________________
```

---

# 12. Impression

```
Impression

__________________________________

__________________________________
```

---

# 13. Recommendation

```
Recommendation

__________________________________

__________________________________
```

---

# 14. Report Preview

```
Report

------------------------------------------------

Patient

Study Date

Operator

------------------------------------------------

Findings

...

------------------------------------------------

Impression

...

------------------------------------------------

Recommendation

...

------------------------------------------------

Annotated Image

------------------------------------------------

[ Export PDF ]

[ Export Word ]
```

---

# 15. Download Center

```
Download

--------------------------------

Original Image

Annotated Image

Annotation JSON

--------------------------------

PDF Report

Word Report

--------------------------------

YOLO Dataset

COCO Dataset

LabelMe JSON
```

---

# 16. Mobile Layout

The mobile interface uses a single-column layout.

```
Medical Image

↓

Toolbar

↓

Image

↓

Lesions

↓

Structured Report

↓

Findings

↓

Recommendation

↓

Save
```

---

# 17. Color Guidelines

Primary

Blue

Action

Green

Warning

Orange

Delete

Red

Background

White

Metadata

Gray

---

# 18. Typography

Heading

Bold

Body

Regular

Metadata

Small Gray

Buttons

Medium

---

# 19. Future UI Components

Planned components

- AI Assistant Panel
- DICOM Metadata Viewer
- Timeline Viewer
- Lesion Comparison
- PACS Browser
- Multi-image Reading
- Split-screen Comparison
- AI Heatmap Overlay

---

# 20. Current Implementation Status

Completed

✓ Dashboard

✓ Project Management

✓ Medical Image Repository

✓ Image Viewer

✓ Zoom

✓ Pan

✓ Rectangle Annotation

✓ Annotation Update

✓ Annotation Delete

✓ Download Original Image

✓ Download Annotated Image

✓ Annotation JSON

In Progress

□ Polygon Annotation

□ Lesion Manager

□ Structured Report

Planned

□ AI Reading Assistant

□ Report Generator

□ DICOM Viewer

□ PACS Integration