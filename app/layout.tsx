// app/layout.tsx
import "./globals.css";
import React from "react";

export const metadata = {
  title: "Complaint Management",
  description: "Next.js + MongoDB + Nodemailer + JWT example",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="nav-container">
            <a href="/" className="nav-link">
              <h1 className="nav-logo" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                Complaint Management
              </h1>
            </a>
            <div className="nav-links">
              <a href="/" className="nav-link">Submit Complaint</a>
              <a href="/login" className="nav-link">Login</a>
              <a href="/register" className="nav-link">Register</a>
              <a href="/admin" className="nav-link" style={{ 
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                marginLeft: '1rem'
              }}>
                Admin Portal
              </a>
            </div>
          </div>
        </nav>

        <div className="container">
          <main style={{ minHeight: 'calc(100vh - 200px)' }}>{children}</main>

          <footer className="text-center" style={{ 
            marginTop: '3rem',
            padding: '2rem',
            color: 'var(--text-secondary)',
            borderTop: '1px solid #E5E7EB'
          }}>
            <p>Built with Next.js • MongoDB • Nodemailer • JWT</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
