import { sendEmail } from "./sendEmail.js";

/**
 * Strictly typed structure for enquiry notification emails.
 */
export interface EnquiryNotificationData {
  name: string;
  email: string;
  phone: string;
  type: string;        // e.g., TOUR / HOTEL / UNKNOWN
  message?: string | null;
}

/**
 * Send enquiry notification email to all admin emails.
 */
export async function sendEnquiryNotification(
  emails: string[],
  enquiry: EnquiryNotificationData
) {
  const subject = `New Enquiry Received – ${enquiry.name}`;

  const html = `
    <div style="font-family: Arial, sans-serif; background: #f7f8fa; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 25px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
        
        <h2 style="color: #10264D; margin-bottom: 10px;">
          New Enquiry Notification
        </h2>

        <p style="font-size: 15px; color: #333;">
          You have received a new enquiry. Here are the details:
        </p>

        <div style="margin-top: 20px; font-size: 14px; color: #444; line-height: 1.6;">
          <p><strong>Name:</strong> ${enquiry.name}</p>
          <p><strong>Email:</strong> ${enquiry.email}</p>
          <p><strong>Phone:</strong> ${enquiry.phone}</p>
          <p><strong>Type:</strong> ${enquiry.type}</p>
          <p><strong>Message:</strong> ${enquiry.message || "No message provided"}</p>
        </div>

        <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;" />

        <p style="font-size: 12px; color: #999; text-align: center;">
          © ${new Date().getFullYear()} ChaloChutti. All rights reserved.
        </p>
      </div>
    </div>
  `;

  const text = `
New Enquiry Received

Name: ${enquiry.name}
Email: ${enquiry.email}
Phone: ${enquiry.phone}
Type: ${enquiry.type}
Message: ${enquiry.message || "No message provided"}

© ${new Date().getFullYear()} ChaloChutti
  `;

  // Send notification to all admin emails
  for (const email of emails) {
    await sendEmail(email.trim(), subject, html, text);
  }
}
