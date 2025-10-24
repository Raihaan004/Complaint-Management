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

// Simple send helper
export async function sendMail({ subject, html, to = adminEmail }: { subject: string; html: string; to?: string }) {
  if (!transporter) return;
  await transporter.sendMail({
    from: user,
    to,
    subject,
    html,
  });
}
