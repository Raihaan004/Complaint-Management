// lib/nodemailer.ts
import nodemailer from "nodemailer";

const host = process.env.EMAIL_HOST;
const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587;
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const adminEmail = process.env.ADMIN_EMAIL;

if (!host || !user || !pass || !adminEmail) {
  console.warn("Nodemailer env not fully configured (EMAIL_HOST/EMAIL_USER/EMAIL_PASS/ADMIN_EMAIL)");
}

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
});

// Enhanced email sender with proper formatting and metadata
export async function sendMail({ 
  subject, 
  html, 
  to = adminEmail,
  metadata = {} 
}: { 
  subject: string; 
  html: string; 
  to?: string;
  metadata?: {
    isAdminNotification?: boolean;
    userEmail?: string;
    description?: string;
  };
}) {
  if (!transporter || !adminEmail) {
    console.error("Email configuration missing");
    return;
  }

  try {
    await transporter.sendMail({
      from: {
        name: "Complaint Management System",
        address: adminEmail
      },
      to,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { 
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: #4F46E5;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .content {
                background-color: #f9fafb;
                padding: 20px;
                border-radius: 0 0 8px 8px;
                border: 1px solid #e5e7eb;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                color: #6b7280;
                font-size: 0.875rem;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin:0;">Complaint Management System</h2>
              </div>
              <div class="content">
                ${html}
              </div>
              <div class="footer">
                <p>This is an automated message from your Complaint Management System</p>
              </div>
            </div>
          </body>
        </html>
      `
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

// Helper function to send notifications to both admin and user
export async function sendNotifications({
  userEmail,
  adminSubject,
  adminHtml,
  userSubject,
  userHtml
}: {
  userEmail: string;
  adminSubject: string;
  adminHtml: string;
  userSubject: string;
  userHtml: string;
}) {
  try {
    // Send to admin
    await sendMail({
      to: adminEmail,
      subject: adminSubject,
      html: adminHtml
    });

    // Send to user
    if (userEmail) {
      await sendMail({
        to: userEmail,
        subject: userSubject,
        html: userHtml
      });
    }
  } catch (error) {
    console.error("Failed to send notifications:", error);
    throw error;
  }
}
