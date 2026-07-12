"use client";

import {
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

export type ViewerImage = {
  id: string;
  image_uid: string;
  original_filename: string;
  file_format: string;
  modality: string;
  body_region: string;
  image_width?: number | null;
  image_height?: number | null;
  uploaded_at?: string;
  storage_path?: string | null;
  sha256_hash?: string | null;
};

type ImageViewerProps = {
  image: ViewerImage;
  imageUrl: string;
  onClose: () => void;
};

export default function ImageViewer({
  image,
  imageUrl,
  onClose,
}: ImageViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showMetadata, setShowMetadata] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  function resetView() {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }

  function zoomIn() {
    setZoom((current) => Math.min(5, current + 0.25));
  }

  function zoomOut() {
    setZoom((current) => {
      const nextZoom = Math.max(0.5, current - 0.25);

      if (nextZoom <= 1) {
        setPosition({ x: 0, y: 0 });
      }

      return nextZoom;
    });
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (zoom <= 1) return;

    event.currentTarget.setPointerCapture(event.pointerId);

    setIsDragging(true);
    setDragStart({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isDragging || zoom <= 1) return;

    setPosition({
      x: event.clientX - dragStart.x,
      y: event.clientY - dragStart.y,
    });
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await viewerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen operation failed:", error);
    }
  }

  function handleDownload() {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = image.original_filename || `${image.image_uid}.${image.file_format}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === viewerRef.current);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !document.fullscreenElement) {
        onClose();
      }

      if (event.key === "+" || event.key === "=") {
        zoomIn();
      }

      if (event.key === "-") {
        zoomOut();
      }

      if (event.key === "0") {
        resetView();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div
        ref={viewerRef}
        className="flex max-h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Medical Image Viewer
            </h2>
            <p className="text-xs text-slate-500">{image.image_uid}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={zoomOut}
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-300"
            >
              −
            </button>

            <span className="min-w-16 text-center text-sm font-medium text-slate-700">
              {Math.round(zoom * 100)}%
            </span>

            <button
              type="button"
              onClick={zoomIn}
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-300"
            >
              +
            </button>

            <button
              type="button"
              onClick={resetView}
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-300"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={() => setShowMetadata((current) => !current)}
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-300"
            >
              {showMetadata ? "Hide Metadata" : "Show Metadata"}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-300"
            >
              {isFullscreen ? "Exit Full Screen" : "Full Screen"}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              Download
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </header>

        <div
          className={`grid min-h-0 flex-1 ${
            showMetadata ? "grid-cols-1 lg:grid-cols-[1fr_320px]" : "grid-cols-1"
          }`}
        >
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`relative flex min-h-[65vh] touch-none items-center justify-center overflow-hidden bg-black ${
              zoom > 1
                ? isDragging
                  ? "cursor-grabbing"
                  : "cursor-grab"
                : "cursor-default"
            }`}
          >
            <img
              src={imageUrl}
              alt={image.image_uid}
              draggable={false}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: "center center",
              }}
              className="max-h-[78vh] max-w-full select-none object-contain"
            />

            <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-black/60 px-3 py-1 text-xs text-white">
              {zoom > 1
                ? "Drag the image to move it"
                : "Zoom in to enable dragging"}
            </div>
          </div>

          {showMetadata && (
            <aside className="overflow-y-auto border-l border-slate-200 bg-white p-5">
              <h3 className="text-base font-semibold text-slate-900">
                Image Metadata
              </h3>

              <dl className="mt-5 space-y-4 text-sm">
                <MetadataItem label="Image UID" value={image.image_uid} />

                <MetadataItem
                  label="Original filename"
                  value={image.original_filename}
                />

                <MetadataItem
                  label="File format"
                  value={image.file_format?.toUpperCase()}
                />

                <MetadataItem
                  label="Resolution"
                  value={
                    image.image_width && image.image_height
                      ? `${image.image_width} × ${image.image_height}`
                      : "Not available"
                  }
                />

                <MetadataItem label="Modality" value={image.modality} />

                <MetadataItem label="Body region" value={image.body_region} />

                <MetadataItem
                  label="Uploaded at"
                  value={
                    image.uploaded_at
                      ? new Date(image.uploaded_at).toLocaleString()
                      : "Not available"
                  }
                />

                <MetadataItem
                  label="SHA-256"
                  value={image.sha256_hash || "Not available"}
                  breakAll
                />
              </dl>

              <div className="mt-6 rounded-lg bg-slate-100 p-4 text-xs leading-5 text-slate-600">
                Patient identifiers such as Patient ID, patient name, date of
                birth, and hospital registration number are not collected.
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

function MetadataItem({
  label,
  value,
  breakAll = false,
}: {
  label: string;
  value: string;
  breakAll?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd
        className={`mt-1 text-slate-900 ${
          breakAll ? "break-all font-mono text-xs" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}