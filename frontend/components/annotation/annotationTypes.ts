import type { Annotation } from "@/services/api";

export type DrawingRectangle = {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
};

export type NormalizedRectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type AnnotationSelectionHandler = (
  annotation: Annotation
) => void;