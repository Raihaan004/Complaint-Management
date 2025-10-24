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
        <div className="container">
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h1>Complaint Management</h1>
            <nav>
              <a style={{ marginRight: 10 }} href="/">Submit</a>
              <a style={{ marginRight: 10 }} href="/login">Login</a>
              <a style={{ marginRight: 10 }} href="/register">Register</a>
              <a href="/admin">Admin</a>
            </nav>
          </header>

          <main>{children}</main>

          <footer style={{ marginTop: 40, color: "#666" }}>
            <small>Built with Next.js • MongoDB • Nodemailer • JWT</small>
          </footer>
        </div>
      </body>
    </html>
  );
}
