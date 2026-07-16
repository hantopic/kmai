const API_BASE = "";
export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

export function logout() {
  localStorage.removeItem("kmai_token");
}

export async function getCurrentUser() {
  const token = localStorage.getItem("kmai_token");

  if (!token) {
    throw new Error("No token");
  }

  const res = await fetch(`${API_BASE}/api/v1/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to get current user");
  }

  return res.json();
}
export async function getProjects() {
  const token = localStorage.getItem("kmai_token");

  const res = await fetch(`/api/v1/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load projects");
  }

  return res.json();
}

export async function createProject(data: {
  name: string;
  description: string;
  modality: string;
  body_region: string;
}) {
  const token = localStorage.getItem("kmai_token");

  const res = await fetch(`/api/v1/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create project");
  }

  return res.json();
}
export async function uploadMedicalImage(formData: FormData) {
  const token = localStorage.getItem("kmai_token");

  const res = await fetch(`/api/v1/medical-images/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload medical image");
  }

  return res.json();
}

export async function getMedicalImages(projectId?: string) {
  const token = localStorage.getItem("kmai_token");

  const url = projectId
    ? `/api/v1/medical-images?project_id=${projectId}`
    : `/api/v1/medical-images`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load medical images");
  }

  return res.json();
}
export type Annotation = {
  id: string;
  image_id: string;
  reviewer_id?: string | null;
  annotation_type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string | null;
  comment?: string | null;
  created_at: string;
  updated_at: string;
};

export type AnnotationCreate = {
  image_id: string;
  annotation_type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  comment?: string;
};

function getAuthHeaders() {
  const token = localStorage.getItem("kmai_token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getAnnotations(
  imageId: string
): Promise<Annotation[]> {
  const params = new URLSearchParams({ image_id: imageId });

  const response = await fetch(`/api/v1/annotations?${params.toString()}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load annotations");
  }

  return response.json();
}

export async function createAnnotation(
  data: AnnotationCreate
): Promise<Annotation> {
  const response = await fetch("/api/v1/annotations", {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.detail || "Failed to create annotation");
  }

  return response.json();
}

export async function updateAnnotation(
  annotationId: string,
  data: Partial<
    Pick<
      AnnotationCreate,
      "x" | "y" | "width" | "height" | "label" | "comment"
    >
  >
): Promise<Annotation> {
  const response = await fetch(`/api/v1/annotations/${annotationId}`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.detail || "Failed to update annotation");
  }

  return response.json();
}

export async function deleteAnnotation(
  annotationId: string
): Promise<void> {
  const response = await fetch(`/api/v1/annotations/${annotationId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.detail || "Failed to delete annotation");
  }
}