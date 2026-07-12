"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createProject, getProjects } from "@/services/api";

type Project = {
  id: string;
  name: string;
  description: string;
  modality: string;
  body_region: string;
  is_active: boolean;
  created_at: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("Thyroid Ultrasound Consensus 2026");
  const [description, setDescription] = useState(
    "Phase 1 thyroid ultrasound consensus labeling project"
  );
  const [message, setMessage] = useState("");

  async function loadProjects() {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch {
      setMessage("Failed to load projects");
    }
  }

  async function handleCreateProject() {
    try {
      await createProject({
        name,
        description,
        modality: "ultrasound",
        body_region: "thyroid",
      });

      setMessage("Project created successfully");
      await loadProjects();
    } catch {
      setMessage("Failed to create project");
    }
  }

  useEffect(() => {
  let cancelled = false;

  async function initializeProjects() {
    try {
      const data = await getProjects();

      if (!cancelled) {
        setProjects(data);
      }
    } catch {
      if (!cancelled) {
        setMessage("Failed to load projects");
      }
    }
  }

  void initializeProjects();

  return () => {
    cancelled = true;
  };
}, []);

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/dashboard" className="text-sm text-slate-500">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">Projects</h1>
        <p className="mt-2 text-slate-600">
          Manage KMAI clinical AI projects.
        </p>

        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">New Project</h2>

          <div className="mt-5">
            <label className="text-sm font-medium">Project Name</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Modality</label>
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
                value="ultrasound"
                readOnly
              />
            </div>

            <div>
              <label className="text-sm font-medium">Body Region</label>
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
                value="thyroid"
                readOnly
              />
            </div>
          </div>

          <button
            onClick={handleCreateProject}
            className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-white hover:bg-slate-700"
          >
            Create Project
          </button>

          {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Project List</h2>

          <div className="mt-5 space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <h3 className="font-semibold text-slate-900">
                  {project.name}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {project.description}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  {project.modality} · {project.body_region} ·{" "}
                  {project.is_active ? "active" : "inactive"}
                </p>
              </div>
            ))}

            {projects.length === 0 && (
              <p className="text-sm text-slate-500">No projects yet.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
