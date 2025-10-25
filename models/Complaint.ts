// models/Complaint.ts
import mongoose, { Schema, model, models } from "mongoose";

export type IComplaint = {
  _id?: string;
  title: string;
  description?: string;
  category?: string;
  priority?: "Low" | "Medium" | "High";
  status?: "Pending" | "In Progress" | "Resolved";
  dateSubmitted?: Date;
  userEmail: string;
  statusHistory?: Array<{
    status: string;
    date: Date;
    comment?: string;
  }>;
};

const ComplaintSchema = new Schema<IComplaint>({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
  status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" },
  dateSubmitted: { type: Date, default: Date.now },
  userEmail: { type: String, required: true },
  statusHistory: [{
    status: { type: String, required: true },
    date: { type: Date, default: Date.now },
    comment: { type: String }
  }]
});

const ComplaintModel = models.Complaint || model<IComplaint>("Complaint", ComplaintSchema);
export default ComplaintModel;
