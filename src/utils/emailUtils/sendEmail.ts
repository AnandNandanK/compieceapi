import transporter from "../../config/mailer.js"; 

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
) {
  return transporter.sendMail({
    from: `"ChaloChutti" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text,
  });
}
