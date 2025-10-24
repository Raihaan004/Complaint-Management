import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Complaint from "@/models/Complaint";
import { sendMail } from "@/lib/nodemailer";
import { requireAuth } from "@/app/api/complaints/authHelper";

// ✅ FIXED: Await context.params (App Router passes it as a Promise)
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  // Admin only: update (status primarily)
  const auth = requireAuth(req, ["admin"]);
  if (auth instanceof NextResponse) return auth;

  try {
    await dbConnect();
    const body = await req.json();
    const updated = await Complaint.findByIdAndUpdate(id, body, { new: true });

    if (!updated)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Send email to admin confirming status update
    const html = `
      <h3>Complaint Updated</h3>
      <p><b>Title:</b> ${updated.title}</p>
      <p><b>New Status:</b> ${updated.status}</p>
      <p><i>Updated at ${new Date().toLocaleString()}</i></p>
    `;

    await sendMail({
      subject: `Complaint Updated: ${updated.title}`,
      html,
    });

    return NextResponse.json({ message: "Updated", complaint: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  // Admin only
  const auth = requireAuth(req, ["admin"]);
  if (auth instanceof NextResponse) return auth;

  try {
    await dbConnect();
    const deleted = await Complaint.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
