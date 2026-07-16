# KMAI AI Architecture

Document ID: KMAI-AI-001  
Version: 0.1.0  
Status: Draft  
Platform: KMAI Medical Image Reading Platform  
Last Updated: July 2026

---

## 1. Purpose

This document defines the artificial intelligence architecture of the KMAI platform.

KMAI is designed as an AI-assisted medical image reading platform.

The AI system supports:

- Lesion candidate detection
- Lesion segmentation
- Structured finding suggestion
- TI-RADS suggestion
- Findings draft generation
- Impression draft generation
- Recommendation draft generation
- Annotated image generation
- Research dataset preparation

AI output must remain a draft suggestion until reviewed and approved by an authorized human reader.

---

## 2. AI Design Principles

KMAI AI development follows these principles:

- Human-in-the-loop
- Privacy by design
- Explainable output
- Traceable model versions
- Reproducible inference
- Modular model architecture
- Clear separation of AI draft and final interpretation
- No automatic clinical finalization
- Continuous performance monitoring
- Research and validation before clinical deployment

---

## 3. AI-Assisted Reading Workflow

```text
Medical Image
      ↓
Image Preprocessing
      ↓
AI Lesion Candidate Detection
      ↓
AI Segmentation Suggestion
      ↓
Reader Review
      ↓
Accept / Modify / Reject
      ↓
Structured Finding Entry
      ↓
TI-RADS Suggestion
      ↓
AI Report Draft
      ↓
Human Review and Approval
      ↓
Final Report
```

---

## 4. Core AI Modules

The KMAI AI architecture is divided into the following modules:

```text
Image Preprocessing
Lesion Detection
Lesion Segmentation
Feature Classification
TI-RADS Assessment
Structured Report Generation
Quality Control
Model Monitoring
```

---

## 5. Image Preprocessing Module

The image preprocessing module prepares uploaded medical images for AI inference.

Recommended functions:

- File validation
- Image orientation check
- Resolution normalization
- Grayscale conversion
- Contrast normalization
- Noise reduction
- Ultrasound image region extraction
- Removal of non-image borders
- Device overlay handling
- Duplicate detection
- Image-quality assessment

The original uploaded image must be preserved separately from the preprocessed AI input.

```text
Original Image
      ├── Secure Storage
      └── Preprocessing Copy
              ↓
           AI Model
```

---

## 6. Lesion Detection Module

The lesion detection module identifies candidate thyroid nodules or other target lesions.

Potential model families:

- YOLO
- RT-DETR
- Faster R-CNN
- RetinaNet
- EfficientDet
- Transformer-based object detectors

Input:

```text
Medical image
```

Output:

```json
{
  "model_name": "thyroid-detector",
  "model_version": "1.0.0",
  "candidates": [
    {
      "label": "nodule",
      "confidence": 0.91,
      "x": 0.31,
      "y": 0.27,
      "width": 0.22,
      "height": 0.18
    }
  ]
}
```

Coordinates should use normalized values between `0.0` and `1.0`.

---

## 7. Lesion Segmentation Module

The segmentation module estimates the lesion boundary.

Potential model families:

- U-Net
- U-Net++
- Attention U-Net
- DeepLabV3+
- Mask R-CNN
- MedSAM
- SAM-based medical models

Output formats:

- Polygon
- Binary mask
- Run-length encoding
- Mask PNG
- COCO segmentation

Example:

```json
{
  "annotation_type": "polygon",
  "points": [
    { "x": 0.25, "y": 0.30 },
    { "x": 0.32, "y": 0.26 },
    { "x": 0.41, "y": 0.33 },
    { "x": 0.38, "y": 0.45 },
    { "x": 0.28, "y": 0.44 }
  ],
  "confidence": 0.88
}
```

The user must be able to:

- Accept the proposed boundary
- Modify the proposed boundary
- Reject the proposed boundary
- Replace it with a manual annotation

---

## 8. Structured Feature Classification

The feature-classification module may suggest thyroid ultrasound characteristics.

Potential output fields:

- Composition
- Echogenicity
- Shape
- Margin
- Echogenic foci
- Cystic change
- Calcification
- Vascularity
- Extrathyroidal extension
- Suspicious lymph node

Example:

```json
{
  "composition": {
    "value": "solid",
    "confidence": 0.86
  },
  "echogenicity": {
    "value": "hypoechoic",
    "confidence": 0.81
  },
  "shape": {
    "value": "wider_than_tall",
    "confidence": 0.94
  },
  "margin": {
    "value": "irregular",
    "confidence": 0.72
  },
  "echogenic_foci": {
    "value": "punctate",
    "confidence": 0.68
  }
}
```

Every field should be independently reviewable.

---

## 9. TI-RADS Assessment Module

The TI-RADS module calculates or suggests a category based on structured findings.

Recommended workflow:

```text
Composition
      +
Echogenicity
      +
Shape
      +
Margin
      +
Echogenic Foci
      ↓
Point Calculation
      ↓
TR Category
```

The calculated result should include:

- Individual feature scores
- Total score
- TI-RADS category
- Rule version
- Calculation timestamp
- Manual override status

Example:

```json
{
  "system": "ACR TI-RADS",
  "rule_version": "2017",
  "scores": {
    "composition": 2,
    "echogenicity": 2,
    "shape": 0,
    "margin": 2,
    "echogenic_foci": 3
  },
  "total_score": 9,
  "category": "TR5",
  "manually_overridden": false
}
```

The final category must remain editable by the reader.

---

## 10. Structured Report Generation

The report-generation module creates draft text from approved structured fields.

Input:

```text
Lesion location
Lesion measurements
Composition
Echogenicity
Shape
Margin
Echogenic foci
TI-RADS category
Reader notes
```

Output:

- Findings draft
- Impression draft
- Recommendation draft

Example findings draft:

```text
A 12.3 × 8.4 × 7.1 mm solid hypoechoic nodule is present in the upper portion of the right thyroid lobe. The lesion demonstrates irregular margins and punctate echogenic foci.
```

Example impression draft:

```text
Right thyroid nodule categorized as ACR TI-RADS TR5.
```

Example recommendation draft:

```text
Management should be determined according to the lesion size, current guideline thresholds, clinical history, and professional judgment.
```

AI-generated text must always be labeled as a draft.

---

## 11. AI Output Status

Recommended AI-result statuses:

```text
generated
reviewed
accepted
modified
rejected
expired
```

Example workflow:

```text
AI Generated
      ↓
Reader Reviewed
      ├── Accepted
      ├── Modified
      └── Rejected
```

The original AI result and the final human-edited result should both be preserved for auditing and model evaluation.

---

## 12. Model Registry

Each AI model should be registered with the following information:

| Field | Description |
|---|---|
| model_id | Internal model identifier |
| model_name | Human-readable model name |
| model_version | Version number |
| task_type | Detection, segmentation, classification, report |
| modality | Ultrasound, CT, MRI, etc. |
| body_region | Thyroid, carotid, shoulder, etc. |
| framework | PyTorch, TensorFlow, ONNX |
| model_path | Model storage location |
| input_specification | Input dimensions and preprocessing |
| output_specification | Output schema |
| validation_status | Draft, validated, retired |
| created_at | Registration date |
| activated_at | Activation date |
| retired_at | Retirement date |

---

## 13. AI Inference Record

Every inference should record:

```text
Inference ID
Image ID
Lesion ID
Model ID
Model Version
Input Hash
Preprocessing Version
Output
Confidence
Inference Duration
Created At
Reviewed By
Review Status
Final Decision
```

Example:

```json
{
  "inference_id": "uuid",
  "image_id": "image-uuid",
  "model_name": "thyroid-detector",
  "model_version": "1.0.0",
  "input_sha256": "hash",
  "confidence": 0.91,
  "inference_duration_ms": 184,
  "review_status": "modified"
}
```

---

## 14. Backend AI Service Structure

Recommended backend structure:

```text
backend/app/
├── api/v1/
│   └── ai.py
│
├── models/
│   ├── ai_model.py
│   └── ai_inference.py
│
├── schemas/
│   └── ai.py
│
└── services/
    ├── ai_detection_service.py
    ├── ai_segmentation_service.py
    ├── ai_classification_service.py
    ├── ai_report_service.py
    ├── model_registry_service.py
    └── inference_audit_service.py
```

---

## 15. Frontend AI Components

Recommended frontend structure:

```text
frontend/components/ai/
├── AIAssistantPanel.tsx
├── DetectionSuggestionList.tsx
├── SegmentationOverlay.tsx
├── FeatureSuggestionPanel.tsx
├── TiradsSuggestion.tsx
├── ReportDraftPanel.tsx
├── AIConfidenceBadge.tsx
└── AIReviewActions.tsx
```

Recommended actions:

```text
Accept
Modify
Reject
Hide
Re-run
Compare
```

---

## 16. AI API Design

Recommended endpoints:

### Generate Detection Suggestion

```http
POST /api/v1/ai/detection
```

### Generate Segmentation Suggestion

```http
POST /api/v1/ai/segmentation
```

### Generate Feature Suggestion

```http
POST /api/v1/ai/features
```

### Calculate TI-RADS

```http
POST /api/v1/ai/tirads
```

### Generate Report Draft

```http
POST /api/v1/ai/report-draft
```

### Review AI Result

```http
POST /api/v1/ai/inferences/{inference_id}/review
```

---

## 17. Model Execution Architecture

Initial deployment:

```text
FastAPI
   ↓
Local AI Service
   ↓
Model File
   ↓
CPU or GPU
```

Future deployment:

```text
FastAPI
   ↓
Inference Queue
   ↓
GPU Worker
   ↓
Model Registry
   ↓
Inference Result Store
```

Potential components:

- Celery
- Redis
- RabbitMQ
- NVIDIA Triton Inference Server
- ONNX Runtime
- TorchServe
- Kubernetes

The initial implementation should remain simple until inference volume requires a separate worker architecture.

---

## 18. External LLM Integration

External language models may be used for draft report generation.

Potential providers:

- OpenAI
- Google Gemini
- Anthropic
- Local open-source LLM
- Institution-hosted LLM

Before sending any data to an external model:

- Direct patient identifiers must be excluded.
- Image metadata must be reviewed.
- The minimum necessary information should be used.
- Provider data-retention terms must be reviewed.
- Institutional policy approval may be required.
- External transfer must be logged.

Preferred long-term architecture:

```text
Structured Findings
      ↓
De-identified Prompt
      ↓
Approved LLM
      ↓
Draft Report
      ↓
Reader Review
```

---

## 19. Local LLM Architecture

A local LLM may be deployed for privacy-sensitive workflows.

Potential functions:

- Structured finding summarization
- Findings draft generation
- Impression generation
- Recommendation drafting
- Terminology normalization
- Korean-English translation
- Report style standardization

Potential components:

- vLLM
- llama.cpp
- Ollama
- Hugging Face Transformers
- OpenAI-compatible local endpoint

---

## 20. Multimodal AI Architecture

Future multimodal input may include:

```text
Ultrasound Image
+
Lesion Annotation
+
Structured Findings
+
Clinical Context
+
Laboratory Information
+
Pathology Result
```

Potential output:

```text
Lesion Classification
TI-RADS Suggestion
Differential Interpretation
Follow-up Suggestion
Structured Report
Research Feature Vector
```

Multimodal functions must be introduced only after clear privacy, validation, and governance procedures are established.

---

## 21. AI Validation

Every model should be evaluated using appropriate datasets.

Recommended metrics:

### Detection

- Precision
- Recall
- F1 score
- Average precision
- Mean average precision
- Intersection over union

### Segmentation

- Dice coefficient
- Intersection over union
- Hausdorff distance
- Boundary accuracy

### Classification

- Accuracy
- Sensitivity
- Specificity
- Positive predictive value
- Negative predictive value
- AUROC
- Calibration

### Report Generation

- Clinical correctness
- Completeness
- Unsupported-statement rate
- Reader editing rate
- Reader acceptance rate
- Terminology consistency

---

## 22. Dataset Separation

AI development datasets must be separated into:

```text
Training Set
Validation Set
Internal Test Set
External Test Set
```

Recommended rules:

- No image leakage across sets
- No duplicate images across sets
- Project-level split where appropriate
- Device and institution diversity
- Locked final test set
- Documented inclusion and exclusion criteria

---

## 23. Quality Control

The system should detect potentially unreliable inputs.

Examples:

- Low image resolution
- Excessive noise
- Missing thyroid region
- Unsupported view
- Device overlay obstruction
- Extreme cropping
- Duplicate image
- Corrupted file
- Out-of-distribution image

AI should be permitted to return:

```text
Unable to assess
Low confidence
Unsupported input
Manual review required
```

rather than forcing a prediction.

---

## 24. Explainability

Recommended explainability methods:

- Bounding-box overlay
- Segmentation overlay
- Heatmap
- Feature-level score display
- Confidence values
- Rule-based TI-RADS calculation
- Comparison between AI and final reader selection

Explainability output should not be interpreted as proof of clinical correctness.

---

## 25. Bias and Generalizability

Model validation should consider:

- Ultrasound device manufacturer
- Probe type
- Image resolution
- Institution
- Reader technique
- Body habitus
- Nodule size
- Lesion type
- Prevalence differences
- Geographic differences

Performance must not be assumed to generalize beyond the validated population.

---

## 26. Privacy and Security

AI services must follow the same privacy requirements as the main KMAI platform.

Required controls:

- De-identified inputs
- Encrypted transport
- Protected model endpoints
- Authentication
- Role-based authorization
- Audit logging
- Input-file validation
- Output retention policy
- Model-file integrity verification
- Restricted model-management permissions

---

## 27. Human Oversight

The KMAI AI system must never silently replace the final reader decision.

Required user interface elements:

```text
AI-generated draft
Model name
Model version
Confidence
Generated time
Accept
Modify
Reject
```

The final report must distinguish:

- AI suggestion
- Human modification
- Final approved interpretation

---

## 28. Regulatory Readiness

Before clinical deployment, the following may be required:

- Intended-use definition
- Risk classification
- Software lifecycle documentation
- Clinical performance validation
- Cybersecurity documentation
- Model-change management
- Data-governance documentation
- Human-factors evaluation
- Post-deployment monitoring
- Adverse-event reporting procedure

Research use and clinical use must be clearly distinguished.

---

## 29. AI Development Roadmap

### Phase 1

- Manual annotation
- Structured findings
- Rule-based TI-RADS
- Report templates

### Phase 2

- Detection model
- Segmentation model
- Feature classification
- Confidence display

### Phase 3

- AI report draft
- Human review workflow
- Model registry
- Inference audit

### Phase 4

- DICOM AI pipeline
- Multi-frame analysis
- Local LLM
- External validation

### Phase 5

- Multimodal foundation model
- Clinical decision support
- Multi-organ expansion
- Federated or multi-institutional learning

---

## 30. Current Implementation Status

Implemented:

- Medical image repository
- Manual rectangle annotation
- Normalized annotation coordinates
- Annotation update and deletion
- Annotated PNG export
- Annotation JSON export
- Human-controlled reading workflow foundation

In development:

- Polygon support
- Lesion Manager
- Structured findings
- TI-RADS data model

Planned:

- Detection model
- Segmentation model
- Feature-classification model
- AI TI-RADS suggestion
- AI report generation
- Local LLM
- Model registry
- Inference audit
- External validation