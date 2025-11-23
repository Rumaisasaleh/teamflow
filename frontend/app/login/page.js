"use client";
import React, { useEffect, useState } from "react";
import API from "../../lib/api";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "../../components/AuthProvider";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

useEffect(() => {
    const nav = document.querySelector("nav");
    if (nav) nav.style.display = "none";
    return () => {
      if (nav) nav.style.display = "flex";
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/api/auth/login", { email, password });
      const { token, user } = res.data;
      login(token, user);

      router.push("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Email</label>
          <input required value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input required value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full border p-2 rounded" />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
