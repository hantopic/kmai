"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getProjects,
  uploadMedicalImage,
  getMedicalImages,
} from "@/services/api";

import ImageViewer from "@/components/ImageViewer";

type Project = {
  id: string;
  name: string;
};

type MedicalImage = {
  id: string;
  image_uid: string;
  project_id: string;
  original_filename: string;
  file_format: string;
  modality: string;
  body_region: string;
  image_width?: number;
  image_height?: number;
  uploaded_at: string;
  thumbnail_path?: string;
  storage_path?: string;
  sha256_hash?: string;
};

export default function ImagesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<MedicalImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<MedicalImage | null>(null);
  const [message, setMessage] = useState("");
 
   async function loadImages(selectedProjectId = projectId) {
    if (!selectedProjectId) return;
    const data = await getMedicalImages(selectedProjectId);
    setImages(data);
  }

  async function handleUpload() {
    if (!projectId) {
      setMessage("Please select a project.");
      return;
    }

    if (!file) {
      setMessage("Please select a medical image file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("project_id", projectId);
    formData.append("modality", "ultrasound");
    formData.append("body_region", "thyroid");

    await uploadMedicalImage(formData);

    setMessage("Upload successful");
    setFile(null);
    await loadImages(projectId);
  }

  function fileUrl(path?: string) {
    if (!path) return "";
    return `/uploads/${path.replace(/^uploads\//, "")}`;
  }

  useEffect(() => {
  let cancelled = false;

  async function initializePage() {
    try {
      const projectData = await getProjects();

      if (cancelled) return;

      setProjects(projectData);

      if (projectData.length > 0) {
        const initialProjectId = projectData[0].id;

        setProjectId(initialProjectId);

        const imageData = await getMedicalImages(initialProjectId);

        if (!cancelled) {
          setImages(imageData);
        }
      }
    } catch {
      if (!cancelled) {
        setMessage("Failed to load projects or images.");
      }
    }
  }

  void initializePage();

  return () => {
    cancelled = true;
  };
}, []);

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/dashboard" className="text-sm text-slate-500">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Medical Image Repository
        </h1>

        <p className="mt-2 text-slate-600">
          Upload and manage de-identified medical images.
        </p>

        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Upload Medical Image</h2>

          <div className="mt-5">
            <label className="text-sm font-medium">Project *</label>
            <select
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                loadImages(e.target.value);
              }}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium">Medical Image File *</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.tif,.tiff,.bmp,.dcm"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="mt-2 text-xs text-slate-500">
              Supported: JPG, JPEG, PNG, TIFF, BMP, DICOM. Patient identifiers are not collected.
            </p>
          </div>

          <button
            onClick={handleUpload}
            className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-white hover:bg-slate-700"
          >
            Upload
          </button>

          {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Thumbnail Gallery</h2>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            {images.map((image) => (
              <button
                key={image.id}
                onClick={() => {
                  setSelectedImage(image);
                  setZoom(1);
                }}

                className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:bg-slate-50"
              >
                <div className="flex h-44 items-center justify-center rounded-lg bg-slate-100">
                  {image.thumbnail_path ? (
                    <img
                      src={fileUrl(image.thumbnail_path)}
                      alt={image.image_uid}
                      className="max-h-44 max-w-full rounded object-contain"
                    />
                  ) : (
                    <span className="text-sm text-slate-400">No preview</span>
                  )}
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  {image.image_uid}
                </h3>

                <p className="mt-1 text-xs text-slate-600">
                  {image.original_filename}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {image.file_format} · {image.modality} · {image.body_region}
                  {image.image_width && image.image_height
                    ? ` · ${image.image_width}×${image.image_height}`
                    : ""}
                </p>
              </button>
            ))}

            {images.length === 0 && (
              <p className="text-sm text-slate-500">
                No images uploaded for this project yet.
              </p>
            )}
          </div>
        </div>

        {selectedImage && (
          <ImageViewer
            image={selectedImage}
            imageUrl={fileUrl(selectedImage.storage_path)}
            onClose={() => setSelectedImage(null)}
          />
        )}

      </div>
    </main>
  );
}
