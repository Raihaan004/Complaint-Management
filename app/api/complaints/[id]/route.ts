import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Complaint from "@/models/Complaint";
import { sendMail, sendNotifications } from "@/lib/nodemailer";
import { requireAuth } from "@/app/api/complaints/authHelper";

interface UpdateComplaintBody {
  status?: string;
  comment?: string;
  [key: string]: any;
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  // Admin only: update (status primarily)
  const auth = requireAuth(req, ["admin"]);
  if (auth instanceof NextResponse) return auth;

  try {
    await dbConnect();
    
    // Get the complaint before update
    const existingComplaint = await Complaint.findById(id);
    if (!existingComplaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    // Parse request body
    const updateData: UpdateComplaintBody = await req.json();
    
    // Initialize statusHistory if it doesn't exist
    if (!Array.isArray(existingComplaint.statusHistory)) {
      existingComplaint.statusHistory = [];
      await existingComplaint.save();
    }

    // Create status history entry if status is changing
    const statusIsChanging = updateData.status && updateData.status !== existingComplaint.status;
    
    let updatedComplaint;
    
    if (statusIsChanging) {
      // Add new status history entry
      const historyEntry = {
        status: updateData.status,
        date: new Date(),
        comment: updateData.comment || `Status updated to ${updateData.status}`
      };

      // Update document with new status and history
      updatedComplaint = await Complaint.findByIdAndUpdate(
        id,
        {
          $set: updateData,
          $push: { statusHistory: historyEntry }
        },
        { new: true }
      );

      if (updatedComplaint && updatedComplaint.userEmail) {
        try {
          const statusUpdateTime = new Date().toLocaleString();
          
          await sendNotifications({
            userEmail: updatedComplaint.userEmail,
            adminSubject: `Complaint #${updatedComplaint._id} Status Updated`,
            adminHtml: `
              <h3>Status Update Confirmation</h3>
              <p>The following complaint has been updated:</p>
              <ul>
                <li><strong>Complaint ID:</strong> ${updatedComplaint._id}</li>
                <li><strong>Title:</strong> ${updatedComplaint.title}</li>
                <li><strong>Previous Status:</strong> ${existingComplaint.status}</li>
                <li><strong>New Status:</strong> ${updatedComplaint.status}</li>
                <li><strong>Updated At:</strong> ${statusUpdateTime}</li>
              </ul>
              ${updateData.comment ? `
              <div style="margin-top: 15px;">
                <strong>Admin Comment:</strong>
                <p style="margin-top: 5px; padding: 10px; background-color: #f3f4f6; border-radius: 4px;">
                  ${updateData.comment}
                </p>
              </div>
              ` : ''}
            `,
            userSubject: "Your Complaint Status Has Been Updated",
            userHtml: `
              <h3>Complaint Status Update</h3>
              <p>Dear ${updatedComplaint.name},</p>
              <p>Your complaint has been reviewed and updated:</p>
              <ul>
                <li><strong>Complaint Title:</strong> ${updatedComplaint.title}</li>
                <li><strong>New Status:</strong> ${updatedComplaint.status}</li>
                <li><strong>Updated At:</strong> ${statusUpdateTime}</li>
              </ul>
              ${updateData.comment ? `
              <div style="margin-top: 15px;">
                <strong>Admin Response:</strong>
                <p style="margin-top: 5px; padding: 10px; background-color: #f3f4f6; border-radius: 4px;">
                  ${updateData.comment}
                </p>
              </div>
              ` : ''}
              <p style="margin-top: 20px;">
                Thank you for your patience. If you have any questions, please don't hesitate to contact us.
              </p>
            `
          });
        } catch (emailError) {
          console.error('Failed to send email notifications:', emailError);
          // Continue execution - we don't want to fail the update if just the email fails
        }
      }
    } else {
      // Just update the fields without modifying status history
      updatedComplaint = await Complaint.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );
    }

    if (!updatedComplaint) {
      return NextResponse.json({ error: "Failed to update complaint" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Complaint updated successfully",
      complaint: updatedComplaint
    });

  } catch (error) {
    console.error('Error updating complaint:', error);
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
    
    if (!deleted) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
