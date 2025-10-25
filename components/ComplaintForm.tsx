// components/ComplaintForm.tsx
"use client";
import React, { useState } from "react";

export default function ComplaintForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Product",
    priority: "Low",
    userEmail: ""
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      
      if (!res.ok) {
        setMessage({ type: 'error', text: json.error || "Error submitting complaint" });
      } else {
        setMessage({
          type: 'success',
          text: "Complaint submitted successfully! You will receive a confirmation email shortly."
        });
        setForm({
          title: "",
          description: "",
          category: "Product",
          priority: "Low",
          userEmail: form.userEmail // Keep the email for next submission
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="card">
      <h2>Submit a Complaint</h2>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label htmlFor="email" style={{ 
            display: 'block',
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem'
          }}>Your Email Address*</label>
          <input
            id="email"
            type="email"
            value={form.userEmail}
            required
            onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
            placeholder="Where should we send updates?"
          />
        </div>

        <div>
          <label htmlFor="title" style={{ 
            display: 'block',
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem'
          }}>Complaint Title*</label>
          <input
            id="title"
            placeholder="Brief summary of your complaint"
            value={form.title}
            required
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="description" style={{ 
            display: 'block',
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem'
          }}>Description</label>
          <textarea
            id="description"
            placeholder="Please provide more details about your complaint"
            value={form.description}
            rows={6}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="category" style={{ 
            display: 'block',
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem'
          }}>Category</label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option>Product</option>
            <option>Service</option>
            <option>Support</option>
          </select>
        </div>

        <div>
          <label style={{ 
            display: 'block',
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem'
          }}>Priority Level</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                name="priority"
                checked={form.priority === "Low"}
                onChange={() => setForm({ ...form, priority: "Low" })}
              />
              Low
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                name="priority"
                checked={form.priority === "Medium"}
                onChange={() => setForm({ ...form, priority: "Medium" })}
              />
              Medium
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                name="priority"
                checked={form.priority === "High"}
                onChange={() => setForm({ ...form, priority: "High" })}
              />
              High
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="btn-rainbow"
          disabled={isSubmitting}
          style={{ marginTop: '1rem' }}
        >
          {isSubmitting ? '✨ Submitting...' : '✨ Submit Complaint'}
        </button>

        {message && (
          <div
            style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: message.type === 'success' ? 'var(--success)' : 'var(--error)',
              marginTop: '1rem'
            }}
          >
            {message.text}
          </div>
        )}
      </form>

      <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        <small>* Required fields. You must be logged in to submit a complaint.</small>
      </p>
    </div>
  );
}
