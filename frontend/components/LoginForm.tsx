"use client";

import { useState } from "react";
import { login } from "@/services/api";

export default function LoginForm() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin1234");
  const [message, setMessage] = useState("");

  async function handleLogin() {
    try {
      setMessage("Logging in...");

      const data = await login(username, password);

      localStorage.setItem("kmai_token", data.access_token);

      setMessage("Login success");

      window.location.href = "/dashboard";
    } catch {
      setMessage("Login failed");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-lg">
        <h1 className="text-center text-4xl font-bold text-slate-900">
          KMAI Platform
        </h1>

        <p className="mt-4 text-center text-sm text-slate-600">
          Korean Medicine Artificial Intelligence Platform
        </p>

        <div className="mt-8">
          <label className="text-sm font-medium text-slate-700">
            Username
          </label>
          <input
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mt-5">
          <label className="text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className="mt-8 w-full rounded-lg bg-slate-900 px-4 py-3 text-white hover:bg-slate-700"
        >
          Login
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-slate-600">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">
          Version 0.2.0
        </p>
      </div>
    </main>
  );
}
