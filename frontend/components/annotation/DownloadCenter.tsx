"use client";

import { useState } from "react";

import type { Annotation } from "@/services/api";

type DownloadCenterProps = {
  imageUrl: string;
  imageUid: string;
  originalFilename: string;
  annotations: Annotation[];
};

function sanitizeFilename(value: string): string {
  return value.replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_");
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = sanitizeFilename(filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
}

function loadImage(imageUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Failed to load the medical image."));
    image.src = imageUrl;
  });
}

export default function DownloadCenter({
  imageUrl,
  imageUid,
  originalFilename,
  annotations,
}: DownloadCenterProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  async function downloadOriginalImage() {
    try {
      setIsWorking(true);
      setMessage("Preparing original image...");

      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error("Failed to download original image.");
      }

      const blob = await response.blob();

      triggerBlobDownload(
        blob,
        originalFilename || `${imageUid}.png`
      );

      setMessage("Original image downloaded.");
      setOpen(false);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to download original image."
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function downloadAnnotatedImage() {
    try {
      setIsWorking(true);
      setMessage("Creating annotated PNG...");

      const image = await loadImage(imageUrl);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas is not supported.");
      }

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      context.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const baseLineWidth = Math.max(
        2,
        Math.round(Math.min(canvas.width, canvas.height) * 0.004)
      );

      const fontSize = Math.max(
        16,
        Math.round(Math.min(canvas.width, canvas.height) * 0.025)
      );

      context.lineJoin = "round";
      context.lineCap = "round";
      context.font = `700 ${fontSize}px Arial, sans-serif`;
      context.textBaseline = "top";

      annotations.forEach((annotation, index) => {
        const x = annotation.x * canvas.width;
        const y = annotation.y * canvas.height;
        const width = annotation.width * canvas.width;
        const height = annotation.height * canvas.height;

        const label =
          annotation.label?.trim() ||
          `Annotation ${index + 1}`;

        context.strokeStyle = "#ef4444";
        context.fillStyle = "rgba(239, 68, 68, 0.12)";
        context.lineWidth = baseLineWidth;

        context.fillRect(x, y, width, height);
        context.strokeRect(x, y, width, height);

        const horizontalPadding = fontSize * 0.4;
        const verticalPadding = fontSize * 0.25;
        const textWidth = context.measureText(label).width;

        const labelWidth = textWidth + horizontalPadding * 2;
        const labelHeight = fontSize + verticalPadding * 2;

        const labelX = Math.max(
          0,
          Math.min(x, canvas.width - labelWidth)
        );

        const preferredLabelY = y - labelHeight;
        const labelY =
          preferredLabelY >= 0
            ? preferredLabelY
            : Math.min(
                canvas.height - labelHeight,
                y + baseLineWidth
              );

        context.fillStyle = "rgba(239, 68, 68, 0.92)";
        context.fillRect(
          labelX,
          labelY,
          labelWidth,
          labelHeight
        );

        context.fillStyle = "#ffffff";
        context.fillText(
          label,
          labelX + horizontalPadding,
          labelY + verticalPadding
        );
      });

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject(
                new Error("Failed to create annotated PNG.")
              );
            }
          },
          "image/png",
          1
        );
      });

      triggerBlobDownload(
        blob,
        `${imageUid}_annotated.png`
      );

      setMessage("Annotated PNG downloaded.");
      setOpen(false);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to create annotated PNG."
      );
    } finally {
      setIsWorking(false);
    }
  }

  function downloadAnnotationJson() {
    try {
      setIsWorking(true);
      setMessage("Creating annotation JSON...");

      const exportData = {
        format: "KMAI Annotation",
        version: "1.0",
        image_uid: imageUid,
        original_filename: originalFilename,
        coordinate_system: {
          type: "normalized",
          range: [0, 1],
          origin: "top-left",
        },
        exported_at: new Date().toISOString(),
        annotations: annotations.map((annotation) => ({
          id: annotation.id,
          type: annotation.annotation_type,
          label: annotation.label,
          comment: annotation.comment,
          rectangle: {
            x: annotation.x,
            y: annotation.y,
            width: annotation.width,
            height: annotation.height,
          },
          reviewer_id: annotation.reviewer_id,
          created_at: annotation.created_at,
          updated_at: annotation.updated_at,
        })),
      };

      const blob = new Blob(
        [JSON.stringify(exportData, null, 2)],
        {
          type: "application/json;charset=utf-8",
        }
      );

      triggerBlobDownload(
        blob,
        `${imageUid}_annotations.json`
      );

      setMessage("Annotation JSON downloaded.");
      setOpen(false);
    } catch {
      setMessage("Failed to create annotation JSON.");
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <div className="relative mb-4 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Download Center
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Download the original image, annotated PNG, or
            annotation JSON.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          disabled={isWorking}
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isWorking ? "Preparing..." : "Download ▾"}
        </button>
      </div>

      {open && (
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <button
            type="button"
            onClick={downloadOriginalImage}
            className="rounded-lg border border-slate-200 p-4 text-left hover:bg-slate-50"
          >
            <span className="block text-sm font-semibold text-slate-900">
              Original Image
            </span>

            <span className="mt-1 block text-xs text-slate-500">
              Download the uploaded image without annotations.
            </span>
          </button>

          <button
            type="button"
            onClick={downloadAnnotatedImage}
            disabled={annotations.length === 0}
            className="rounded-lg border border-slate-200 p-4 text-left hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="block text-sm font-semibold text-slate-900">
              Annotated PNG
            </span>

            <span className="mt-1 block text-xs text-slate-500">
              Include rectangles and annotation labels.
            </span>
          </button>

          <button
            type="button"
            onClick={downloadAnnotationJson}
            className="rounded-lg border border-slate-200 p-4 text-left hover:bg-slate-50"
          >
            <span className="block text-sm font-semibold text-slate-900">
              Annotation JSON
            </span>

            <span className="mt-1 block text-xs text-slate-500">
              Export normalized coordinates and metadata.
            </span>
          </button>
        </div>
      )}

      {annotations.length === 0 && open && (
        <p className="mt-3 text-xs text-amber-700">
          Annotated PNG is available after at least one
          annotation has been saved.
        </p>
      )}

      {message && (
        <p className="mt-3 text-sm text-slate-700">
          {message}
        </p>
      )}
    </div>
  );
}