"use client";

type AnnotationToolbarProps = {
  imageUid: string;
  annotationCount: number;

  drawMode: boolean;
  isSaving: boolean;
  hasSelection: boolean;

  label: string;
  comment: string;
  message: string;

  onToggleDrawMode: () => void;
  onLabelChange: (value: string) => void;
  onCommentChange: (value: string) => void;
  onClearSelection: () => void;
  onUpdateSelected: () => void;
  onDeleteSelected: () => void;
};

export default function AnnotationToolbar({
  imageUid,
  annotationCount,
  drawMode,
  isSaving,
  hasSelection,
  label,
  comment,
  message,
  onToggleDrawMode,
  onLabelChange,
  onCommentChange,
  onClearSelection,
  onUpdateSelected,
  onDeleteSelected,
}: AnnotationToolbarProps) {
  return (
    <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-end gap-3">
        <button
          type="button"
          onClick={onToggleDrawMode}
          disabled={isSaving}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            drawMode
              ? "bg-blue-700 text-white"
              : "bg-slate-200 text-slate-900 hover:bg-slate-300"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {drawMode ? "Rectangle Tool Active" : "Rectangle Tool"}
        </button>

        <div>
          <label className="block text-xs font-medium text-slate-600">
            Label
          </label>

          <input
            type="text"
            value={label}
            onChange={(event) => onLabelChange(event.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="nodule"
          />
        </div>

        <div className="min-w-56 flex-1">
          <label className="block text-xs font-medium text-slate-600">
            Comment (Optional)
          </label>

          <input
            type="text"
            value={comment}
            onChange={(event) => onCommentChange(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Optional comment"
          />
        </div>

        <button
          type="button"
          onClick={onClearSelection}
          disabled={!hasSelection || isSaving}
          className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear Selection
        </button>

        <button
          type="button"
          onClick={onUpdateSelected}
          disabled={!hasSelection || isSaving}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSaving ? "Saving..." : "Update Selected"}
        </button>

        <button
          type="button"
          onClick={onDeleteSelected}
          disabled={!hasSelection || isSaving}
          className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Delete Selected
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
        <span>Image: {imageUid}</span>
        <span>Annotations: {annotationCount}</span>

        <span>
          {drawMode
            ? "Drag over the image to create a rectangle."
            : "Activate the Rectangle Tool to draw."}
        </span>
      </div>

      {message && (
        <p className="mt-3 text-sm text-slate-700">{message}</p>
      )}
    </div>
  );
}