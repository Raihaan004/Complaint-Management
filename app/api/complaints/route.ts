// app/api/complaints/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Complaint from "@/models/Complaint";
import { sendMail } from "@/lib/nodemailer";
import { requireAuth } from "./authHelper";

export async function GET(req: Request) {
  // Admin only: list all complaints
  const auth = requireAuth(req, ["admin"]);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();
  const items = await Complaint.find().sort({ dateSubmitted: -1 });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  // Any logged-in user can create complaint (user or admin)
  const auth = requireAuth(req, ["user", "admin"]);
  if (auth instanceof NextResponse) return auth;

  try {
    await dbConnect();
    const body = await req.json();

    const complaint = await Complaint.create({
      title: body.title,
      description: body.description,
      category: body.category,
      priority: body.priority || "Low",
      userEmail: body.userEmail,
      statusHistory: [{
        status: "Pending",
        date: new Date(),
        comment: "Complaint submitted"
      }]
    });

    // Import email templates
    const { getComplaintSubmissionEmail } = await import('@/lib/emailTemplates');

    // Send confirmation email to user
    const userEmail = getComplaintSubmissionEmail(complaint);
    await sendMail({
      to: complaint.userEmail,
      subject: userEmail.subject,
      html: userEmail.html
    });

    // Send notification to admin
    const adminHtml = `
      <h2>New Complaint Submitted</h2>
      <p><b>From:</b> ${complaint.userEmail}</p>
      <p><b>Title:</b> ${complaint.title}</p>
      <p><b>Category:</b> ${complaint.category}</p>
      <p><b>Priority:</b> ${complaint.priority}</p>
      <p><b>Description:</b><br/>${complaint.description}</p>
      <p><i>Submitted at ${complaint.dateSubmitted}</i></p>
    `;
    await sendMail({
      subject: `New Complaint: ${complaint.title}`,
      html: adminHtml
    });

    return NextResponse.json({ message: "Complaint created", complaint });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
