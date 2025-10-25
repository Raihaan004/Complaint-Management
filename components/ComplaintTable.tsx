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

  const [selectedComplaint, setSelectedComplaint] = useState<{ id: string; status: string } | null>(null);
  const [statusComment, setStatusComment] = useState("");

  async function updateStatus(id: string, newStatus: string) {
    setSelectedComplaint({ id, status: newStatus });
    setStatusComment("");
  }

  async function confirmStatusUpdate() {
    if (!selectedComplaint) return;

    const token = localStorage.getItem("token");
    const response = await fetch(`/api/complaints/${selectedComplaint.id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ 
        status: selectedComplaint.status,
        comment: statusComment.trim() || `Status updated to ${selectedComplaint.status}`
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error?.error || "Failed to update status");
    } else {
      const result = await response.json();
      if (result.message) {
        alert("Status updated successfully!");
      }
    }

    setSelectedComplaint(null);
    setStatusComment("");
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
                  <select 
                    value={c.status} 
                    onChange={(e) => updateStatus(c._id, e.target.value)}
                    style={{
                      backgroundColor: 
                        c.status === 'Pending' ? '#FEF3C7' :
                        c.status === 'In Progress' ? '#DBEAFE' :
                        c.status === 'Resolved' ? '#D1FAE5' :
                        'white'
                    }}
                  >
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

      {/* Status Update Modal */}
      {selectedComplaint && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3 style={{ marginTop: 0 }}>Update Status</h3>
            
            <p style={{ marginBottom: '1rem' }}>
              Changing status to: <strong>{selectedComplaint.status}</strong>
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                color: 'var(--text-secondary)'
              }}>
                Add a comment (optional):
              </label>
              <textarea
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
                placeholder="Enter any additional notes or comments..."
                rows={4}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedComplaint(null)}
                style={{
                  backgroundColor: '#EF4444',
                  color: 'white'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdate}
                className="btn-primary"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
