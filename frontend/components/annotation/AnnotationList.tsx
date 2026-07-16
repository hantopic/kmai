"use client";

import type { Annotation } from "@/services/api";

type AnnotationListProps = {
  annotations: Annotation[];
  selectedAnnotationId: string | null;
  deletingAnnotationId: string | null;
  onSelect: (annotation: Annotation) => void;
  onDelete: (annotation: Annotation) => void;
};

export default function AnnotationList({
  annotations,
  selectedAnnotationId,
  deletingAnnotationId,
  onSelect,
  onDelete,
}: AnnotationListProps) {
  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-900">
        Saved Annotations
      </h3>

      <div className="mt-3 space-y-2">
        {annotations.map((annotation, index) => {
          const selected = selectedAnnotationId === annotation.id;
          const deleting = deletingAnnotationId === annotation.id;

          return (
            <div
              key={annotation.id}
              className={`flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between ${
                selected
                  ? "border-yellow-400 bg-yellow-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(annotation)}
                className="flex-1 text-left"
              >
                <span className="block text-sm font-medium text-slate-900">
                  {index + 1}.{" "}
                  {annotation.label || "Unlabeled rectangle"}
                </span>

                {annotation.comment && (
                  <span className="mt-1 block text-xs text-slate-600">
                    {annotation.comment}
                  </span>
                )}

                <span className="mt-2 block text-xs text-slate-500">
                  x {annotation.x.toFixed(3)}, y{" "}
                  {annotation.y.toFixed(3)}, w{" "}
                  {annotation.width.toFixed(3)}, h{" "}
                  {annotation.height.toFixed(3)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onDelete(annotation)}
                disabled={deleting}
                className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          );
        })}

        {annotations.length === 0 && (
          <p className="text-sm text-slate-500">
            No annotations have been saved for this image.
          </p>
        )}
      </div>
    </div>
  );
}