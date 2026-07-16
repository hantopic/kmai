# Changelog

All notable changes to the KMAI platform are documented in this file.

The format is based on Keep a Changelog principles and uses semantic-style release numbering.

---

## [Unreleased]

### Added

- Polygon-ready annotation database field
- Polygon-ready annotation API schema
- KMAI system architecture documentation
- KMAI database ERD documentation
- KMAI UI wireframe documentation
- KMAI API specification
- KMAI product roadmap

### Changed

- Project direction refined toward a lesion-centered medical image reading platform
- Annotation frontend divided into modular components
- Image upload workflow explicitly excludes direct patient identifiers
- Documentation filenames standardized with numbered prefixes

### Planned

- Lesion Manager
- Annotation-to-lesion linking
- Structured thyroid reading
- TI-RADS calculation
- Polygon annotation frontend
- PDF and Word reports

---

## [0.9.0] - 2026-07

### Added

#### Authentication

- JWT-based login
- Protected API routes
- Current user endpoint
- User listing endpoint

#### Project Management

- Project creation
- Project listing
- Project modality and body-region fields

#### Medical Image Repository

- Medical image upload
- Project selection
- Anonymous Image UID generation
- SHA-256 file hash generation
- Thumbnail generation
- Medical image metadata storage
- Image list by project
- Supported JPG, JPEG, PNG, TIFF, TIF, BMP, and DICOM input

#### Image Viewer

- Thumbnail Gallery
- Large image preview
- Zoom in
- Zoom out
- Reset
- Pan
- Full-screen mode
- Metadata display
- Original image download
- View and Annotate modes

#### Annotation

- Rectangle annotation
- Normalized coordinates
- Annotation label
- Annotation comment
- Annotation creation
- Annotation listing
- Annotation update
- Annotation selection
- Annotation deletion
- Direct deletion from the saved-annotation list

#### Download Center

- Original image download
- Annotated PNG export
- Annotation JSON export

#### Documentation

- Initial medical image model document
- System architecture document
- Database ERD document
- UI wireframe document
- API specification document
- Product roadmap document

### Changed

- Medical image upload form simplified for user convenience
- Optional classification fields removed from the required upload workflow
- Patient ID collection removed from medical image upload
- Image UID generated automatically
- Annotation UI divided into toolbar, list, and download components
- Zoom state shared between View and Annotate modes

### Fixed

- JWT Swagger authorization workflow
- Invalid-token project request issue
- Image thumbnail path rendering
- Image Viewer layout
- Annotation update behavior
- Existing annotation deletion
- Annotate-mode zoom behavior
- Nginx routing for FastAPI Swagger
- Docker backend port mapping
- React lint errors caused by synchronous state calls in effects
- Multiple JSX and Python indentation errors during annotation refactoring

### Security

- Protected project routes
- Protected medical image routes
- Protected annotation routes
- JWT Bearer authentication
- Restricted backend exposure through localhost port mapping
- Privacy statement displayed in the upload interface
- Direct patient identifiers excluded from the standard upload workflow

---

## [0.8.0] - 2026-07

### Added

- Initial Next.js frontend
- Dashboard
- Project page
- Medical Image Repository page
- FastAPI backend
- PostgreSQL database
- Docker deployment
- Nginx reverse proxy
- Swagger API documentation

---

## Release Notes Policy

For each release, document:

- Added features
- Changed behavior
- Fixed issues
- Security changes
- Database migrations
- Deployment changes
- Known limitations

Recommended release tags:

```text
v0.9.0
v1.0.0
v1.1.0
v1.5.0
v2.0.0
```