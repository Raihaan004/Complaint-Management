// lib/emailTemplates.ts
import { IComplaint } from "../models/Complaint";

export function getComplaintSubmissionEmail(complaint: IComplaint): { subject: string; html: string } {
  return {
    subject: `Complaint Submitted - ${complaint.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4F46E5;">Complaint Submitted Successfully</h2>
        <p>Thank you for submitting your complaint. We have received it and will process it shortly.</p>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Complaint Details:</h3>
          <p><strong>Title:</strong> ${complaint.title}</p>
          <p><strong>Category:</strong> ${complaint.category || 'Not specified'}</p>
          <p><strong>Priority:</strong> ${complaint.priority}</p>
          <p><strong>Status:</strong> ${complaint.status}</p>
          <p><strong>Description:</strong> ${complaint.description || 'No description provided'}</p>
        </div>
        
        <p>We will keep you updated on any status changes.</p>
        <p style="color: #666;">Reference ID: ${complaint._id}</p>
      </div>
    `
  };
}

export function getStatusUpdateEmail(complaint: IComplaint, comment?: string): { subject: string; html: string } {
  const statusColors = {
    'Pending': '#FCD34D',
    'In Progress': '#60A5FA',
    'Resolved': '#34D399'
  };
  
  const statusColor = statusColors[complaint.status as keyof typeof statusColors] || '#4F46E5';
  
  return {
    subject: `Complaint Status Updated - ${complaint.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4F46E5;">Complaint Status Update</h2>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Status Update:</h3>
          <p>Your complaint "<strong>${complaint.title}</strong>" has been updated.</p>
          
          <p style="margin: 20px 0;">
            <span style="
              background-color: ${statusColor};
              color: white;
              padding: 8px 16px;
              border-radius: 16px;
              font-weight: bold;
            ">
              ${complaint.status}
            </span>
          </p>
          
          ${comment ? `
            <div style="margin-top: 20px;">
              <h4 style="margin-bottom: 8px;">Additional Comments:</h4>
              <p style="background: white; padding: 12px; border-radius: 4px; margin: 0;">${comment}</p>
            </div>
          ` : ''}
        </div>
        
        <p>You can track your complaint using the reference ID: ${complaint._id}</p>
      </div>
    `
  };
}