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

    const created = await Complaint.create({
      title: body.title,
      description: body.description,
      category: body.category,
      priority: body.priority || "Low",
    });

    // send email to admin with details
    const html = `<h2>New Complaint Submitted</h2>
      <p><b>Title:</b> ${created.title}</p>
      <p><b>Category:</b> ${created.category}</p>
      <p><b>Priority:</b> ${created.priority}</p>
      <p><b>Description:</b><br/>${created.description}</p>
      <p><i>Submitted at ${created.dateSubmitted}</i></p>`;

    await sendMail({ subject: `New Complaint: ${created.title}`, html });

    return NextResponse.json({ message: "Complaint created", complaint: created });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
