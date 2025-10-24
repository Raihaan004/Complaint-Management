// components/ComplaintTable.tsx
"use client";
import React, { useEffect, useState } from "react";

type Complaint = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  priority?: string;
  status?: string;
  dateSubmitted?: string;
};

export default function ComplaintTable() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");

  async function fetchAll() {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/complaints", { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      setComplaints(data);
    } else {
      const err = await res.json();
      alert(err?.error || "Failed to load complaints (are you logged in as admin?)");
    }
  }

  useEffect(() => { fetchAll(); }, []);

  async function updateStatus(id: string, status: string) {
    const token = localStorage.getItem("token");
    await fetch(`/api/complaints/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    fetchAll();
  }

  async function deleteComplaint(id: string) {
    if (!confirm("Delete this complaint?")) return;
    const token = localStorage.getItem("token");
    await fetch(`/api/complaints/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchAll();
  }

  const visible = complaints
    .filter(c => (filterStatus ? c.status === filterStatus : true))
    .filter(c => (filterPriority ? c.priority === filterPriority : true));

  return (
    <div className="card">
      <h2>Admin Dashboard</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>

        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="">All Priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button onClick={fetchAll}>Refresh</button>
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(c => (
              <tr key={c._id}>
                <td style={{ minWidth: 200 }}>{c.title}</td>
                <td>{c.category}</td>
                <td>{c.priority}</td>
                <td>{new Date(c.dateSubmitted || "").toLocaleString()}</td>
                <td>
                  <select value={c.status} onChange={(e) => updateStatus(c._id, e.target.value)}>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => deleteComplaint(c._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center" }}>No complaints.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
