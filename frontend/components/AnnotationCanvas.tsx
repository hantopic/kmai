"use client";
import {
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Annotation,
  createAnnotation,
  deleteAnnotation,
  getAnnotations,
  updateAnnotation,
} from "@/services/api";

import AnnotationList from "./annotation/AnnotationList";
import AnnotationToolbar from "./annotation/AnnotationToolbar";
import DownloadCenter from "./annotation/DownloadCenter";

type AnnotationCanvasProps = {
  imageId: string;
  imageUrl: string;
  imageUid: string;
  originalFilename: string;
  zoom: number;
};

type DrawingRectangle = {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
};

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export default function AnnotationCanvas({
  imageId,
  imageUrl,
  imageUid,
  originalFilename,
  zoom,
}: AnnotationCanvasProps) {
  const overlayRef = useRef<SVGSVGElement>(null);

  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [drawing, setDrawing] = useState<DrawingRectangle | null>(null);
  const [drawMode, setDrawMode] = useState(false);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<
    string | null
  >(null);

  const [label, setLabel] = useState("nodule");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingAnnotationId, setDeletingAnnotationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    async function initializeAnnotations() {
      try {
        const data = await getAnnotations(imageId);

        if (!cancelled) {
          setAnnotations(data);
        }
      } catch {
        if (!cancelled) {
          setMessage("Failed to load annotations.");
        }
      }
    }

    void initializeAnnotations();

    return () => {
      cancelled = true;
    };
  }, [imageId]);

  function getNormalizedPosition(
    event: ReactPointerEvent<SVGSVGElement>
  ): { x: number; y: number } {
    const bounds = event.currentTarget.getBoundingClientRect();

    return {
      x: clamp((event.clientX - bounds.left) / bounds.width),
      y: clamp((event.clientY - bounds.top) / bounds.height),
    };
  }

  function handlePointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    if (!drawMode || isSaving) return;

    if (event.button !== 0) return;

    const position = getNormalizedPosition(event);

    event.currentTarget.setPointerCapture(event.pointerId);

    setSelectedAnnotationId(null);
    setDrawing({
      startX: position.x,
      startY: position.y,
      currentX: position.x,
      currentY: position.y,
    });
  }

  function handlePointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    if (!drawing || !drawMode) return;

    const position = getNormalizedPosition(event);

    setDrawing((current) => {
      if (!current) return null;

      return {
        ...current,
        currentX: position.x,
        currentY: position.y,
      };
    });
  }

  async function handlePointerUp(event: ReactPointerEvent<SVGSVGElement>) {
    if (!drawing || !drawMode) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const position = getNormalizedPosition(event);

    const x = Math.min(drawing.startX, position.x);
    const y = Math.min(drawing.startY, position.y);
    const width = Math.abs(position.x - drawing.startX);
    const height = Math.abs(position.y - drawing.startY);

    setDrawing(null);

    // 너무 작은 사각형은 저장하지 않음
    if (width < 0.01 || height < 0.01) {
      setMessage("The rectangle is too small.");
      return;
    }

    try {
      setIsSaving(true);
      setMessage("Saving annotation...");

      const created = await createAnnotation({
        image_id: imageId,
        annotation_type: "rectangle",
        x,
        y,
        width,
        height,
        label: label.trim() || "nodule",
        comment: comment.trim() || undefined,
      });

      setAnnotations((current) => [...current, created]);
      setSelectedAnnotationId(created.id);
      setLabel(created.label || "nodule");
      setComment(created.comment || "");
      setMessage("Annotation saved successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save annotation."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handlePointerCancel(event: ReactPointerEvent<SVGSVGElement>) {
    setDrawing(null);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleSelectAnnotation(annotation: Annotation) {
    handleSelectAnnotation(annotation);
    setLabel(annotation.label || "nodule");
    setComment(annotation.comment || "");
    setMessage("");
  }

  function handleClearSelection() {
    setSelectedAnnotationId(null);
    setLabel("nodule");
    setComment("");
    setMessage("");
  }

  async function handleUpdateSelected() {
    if (!selectedAnnotation) {
      setMessage("Please select an annotation.");
      return;
    }

    try {
      setIsSaving(true);
      setMessage("Updating annotation...");

      const updated = await updateAnnotation(
        selectedAnnotation.id,
        {
          label: label.trim() || "nodule",
          comment: comment.trim() || "",
        }
      );

      setAnnotations((current) =>
        current.map((annotation) =>
          annotation.id === updated.id ? updated : annotation
        )
      );

      setMessage("Annotation updated successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to update annotation."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteAnnotation(annotation: Annotation) {
    const confirmed = window.confirm(
      `Delete annotation "${annotation.label || "Unlabeled rectangle"}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingAnnotationId(annotation.id);
      setMessage("Deleting annotation...");

      await deleteAnnotation(annotation.id);

      setAnnotations((current) =>
        current.filter((item) => item.id !== annotation.id)
      );

      if (selectedAnnotationId === annotation.id) {
        setSelectedAnnotationId(null);
        setLabel("nodule");
        setComment("");
      }

      setMessage("Annotation deleted successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete annotation."
      );
    } finally {
      setDeletingAnnotationId(null);
    }
  }

  async function handleDeleteSelected() {
    const selectedAnnotation = annotations.find(
      (annotation) => annotation.id === selectedAnnotationId
    );

    if (!selectedAnnotation) {
      setMessage("Please select an annotation.");
      return;
    }

    await handleDeleteAnnotation(selectedAnnotation);
  }

  function getDrawingRectangle() {
    if (!drawing) return null;

    return {
      x: Math.min(drawing.startX, drawing.currentX),
      y: Math.min(drawing.startY, drawing.currentY),
      width: Math.abs(drawing.currentX - drawing.startX),
      height: Math.abs(drawing.currentY - drawing.startY),
    };
  }

  const drawingRectangle = getDrawingRectangle();
  const selectedAnnotation =
    annotations.find(
      (annotation) => annotation.id === selectedAnnotationId
    ) ?? null;

  return (
    <div className="w-full">
      <AnnotationToolbar
        imageUid={imageUid}
        annotationCount={annotations.length}
        drawMode={drawMode}
        isSaving={isSaving}
        hasSelection={selectedAnnotationId !== null}
        label={label}
        comment={comment}
        message={message}
        onToggleDrawMode={() => {
          setDrawMode((current) => !current);
          setDrawing(null);
          setSelectedAnnotationId(null);
          setMessage("");
        }}
        onLabelChange={setLabel}
        onCommentChange={setComment}
        onClearSelection={handleClearSelection}
        onUpdateSelected={handleUpdateSelected}
        onDeleteSelected={handleDeleteSelected}
      />

      <DownloadCenter
        imageUrl={imageUrl}
        imageUid={imageUid}
        originalFilename={originalFilename}
        annotations={annotations}
      />

      <div className="flex min-h-[60vh] items-center justify-center overflow-auto rounded-xl bg-black p-4">
        <div
          className="relative flex-shrink-0"
          style={{
            width: `${zoom * 100}%`,
            maxWidth: zoom <= 1 ? "100%" : "none",
          }}
        >
          <img
            src={imageUrl}
            alt={imageUid}
            draggable={false}
            className="block h-auto w-full select-none object-contain"
          />

          <svg
            ref={overlayRef}
            viewBox="0 0 1 1"
            preserveAspectRatio="none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            className={`absolute inset-0 h-full w-full touch-none ${drawMode ? "cursor-crosshair" : "cursor-default"
              }`}
          >
            {annotations.map((annotation) => {
              const selected =
                selectedAnnotationId === annotation.id;

              return (
                <g key={annotation.id}>
                  <rect
                    x={annotation.x}
                    y={annotation.y}
                    width={annotation.width}
                    height={annotation.height}
                    fill={
                      selected
                        ? "rgba(250, 204, 21, 0.20)"
                        : "rgba(239, 68, 68, 0.14)"
                    }
                    stroke={selected ? "#facc15" : "#ef4444"}
                    strokeWidth={selected ? 0.006 : 0.004}
                    vectorEffect="non-scaling-stroke"
                    onPointerDown={(event) => {
                      if (drawMode) return;

                      event.stopPropagation();
                      handleSelectAnnotation(annotation);
                    }}
                    className={
                      drawMode
                        ? "pointer-events-none"
                        : "cursor-pointer"
                    }
                  />

                  {annotation.label && (
                    <text
                      x={annotation.x}
                      y={Math.max(annotation.y - 0.01, 0.025)}
                      fill={selected ? "#facc15" : "#ef4444"}
                      fontSize="0.025"
                      fontWeight="700"
                      vectorEffect="non-scaling-stroke"
                      className="pointer-events-none select-none"
                    >
                      {annotation.label}
                    </text>
                  )}
                </g>
              );
            })}

            {drawingRectangle && (
              <rect
                x={drawingRectangle.x}
                y={drawingRectangle.y}
                width={drawingRectangle.width}
                height={drawingRectangle.height}
                fill="rgba(59, 130, 246, 0.18)"
                stroke="#3b82f6"
                strokeWidth="0.005"
                strokeDasharray="0.015 0.01"
                vectorEffect="non-scaling-stroke"
                className="pointer-events-none"
              />
            )}
          </svg>
        </div>
      </div>

      <AnnotationList
        annotations={annotations}
        selectedAnnotationId={selectedAnnotationId}
        deletingAnnotationId={deletingAnnotationId}
        onSelect={handleSelectAnnotation}
        onDelete={handleDeleteAnnotation}
      />
    </div>
  );
}