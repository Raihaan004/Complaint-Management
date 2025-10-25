// components/LoginForm.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) return alert(json.error || "Login failed");
    localStorage.setItem("token", json.token);
    alert("Logged in");
    if (json.role === "admin") router.push("/admin");
    else router.push("/");
  }

  return (
    <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h2 style={{ 
            fontSize: '1.875rem',
            fontWeight: '600',
            color: 'var(--primary-color)',
            marginBottom: '0.5rem'
          }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to your account</p>
        </div>
        
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label htmlFor="email" style={{ 
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem'
            }}>Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ marginBottom: 0 }}
            />
          </div>
          
          <div>
            <label htmlFor="password" style={{ 
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem'
            }}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ marginBottom: 0 }}
            />
          </div>

          <button type="submit" className="btn-rainbow" style={{ marginTop: '1rem', width: '100%' }}>
            ✨ Sign In
          </button>
        </form>

        <div className="text-center mt-4" style={{ color: 'var(--text-secondary)' }}>
          <p>Don't have an account? <a href="/register" style={{ 
            color: 'var(--primary-color)',
            textDecoration: 'none',
            fontWeight: '500'
          }}>Register here</a></p>
        </div>
      </div>
    </div>
  );
}
