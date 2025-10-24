// components/ComplaintForm.tsx
"use client";
import React, { useState } from "react";

export default function ComplaintForm() {
  const [form, setForm] = useState({ title: "", description: "", category: "Product", priority: "Low" });
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (!res.ok) {
      setMessage(json.error || "Error submitting");
    } else {
      setMessage("Submitted successfully.");
      setForm({ title: "", description: "", category: "Product", priority: "Low" });
    }
  }

  return (
    <div className="card">
      <h2>Submit a Complaint</h2>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input placeholder="Title" value={form.title} required onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea placeholder="Description" value={form.description} rows={6} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option>Product</option>
          <option>Service</option>
          <option>Support</option>
        </select>
        <div>
          <label style={{ marginRight: 8 }}>
            <input type="radio" name="priority" checked={form.priority === "Low"} onChange={() => setForm({ ...form, priority: "Low" })} /> Low
          </label>
          <label style={{ marginRight: 8 }}>
            <input type="radio" name="priority" checked={form.priority === "Medium"} onChange={() => setForm({ ...form, priority: "Medium" })} /> Medium
          </label>
          <label>
            <input type="radio" name="priority" checked={form.priority === "High"} onChange={() => setForm({ ...form, priority: "High" })} /> High
          </label>
        </div>
        <button type="submit">Submit Complaint</button>
        {message && <p>{message}</p>}
      </form>
      <p style={{ marginTop: 8 }}><small>Note: You must be logged in to submit. Use Register → Login.</small></p>
    </div>
  );
}
