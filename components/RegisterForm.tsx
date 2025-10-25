// components/RegisterForm.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const json = await res.json();
    if (!res.ok) return alert(json.error || "Register failed");
    alert("Registered - please login");
    router.push("/login");
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
          }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Join our community today</p>
        </div>
        
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label htmlFor="name" style={{ 
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem'
            }}>Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ marginBottom: 0 }}
            />
          </div>

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
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Choose a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ marginBottom: 0 }}
            />
          </div>

          <div>
            <label htmlFor="role" style={{ 
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem'
            }}>Account Type</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              style={{ marginBottom: 0 }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn-rainbow" style={{ marginTop: '1rem', width: '100%' }}>
            ✨ Create Account
          </button>
        </form>

        <div className="text-center mt-4" style={{ color: 'var(--text-secondary)' }}>
          <p>Already have an account? <a href="/login" style={{ 
            color: 'var(--primary-color)',
            textDecoration: 'none',
            fontWeight: '500'
          }}>Sign in here</a></p>
        </div>
      </div>
    </div>
  );
}
