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
