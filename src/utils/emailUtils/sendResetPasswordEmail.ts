import { sendEmail } from "./sendEmail.js";

export async function sendResetPasswordEmail(
  to: string,
  resetLink: string
) {
  const subject = "Compiece – Reset Your Password";

  const html = `
  <div style="margin:0; padding:0; background:#f4f6fb; font-family: 'Segoe UI', Roboto, Arial, sans-serif;">
    <div style="max-width:520px; margin:40px auto; padding:20px;">
      
      <div style="
        background: linear-gradient(135deg, #0f172a, #1e293b);
        border-radius:16px;
        padding:2px;
      ">
        <div style="
          background:#ffffff;
          border-radius:14px;
          padding:30px 28px;
        ">

          <h2 style="
            margin:0 0 10px;
            font-size:22px;
            font-weight:600;
            color:#0f172a;
            text-align:center;
          ">
            Reset Your Password
          </h2>

          <p style="
            font-size:14px;
            color:#475569;
            text-align:center;
            margin-bottom:25px;
          ">
            Secure your <strong>Compiece</strong> account
          </p>

          <p style="font-size:15px; color:#334155;">
            Hi,
          </p>

          <p style="font-size:15px; color:#334155; line-height:1.6;">
            We received a request to reset your password. Click the button below to continue.
          </p>

          <div style="text-align:center; margin:30px 0;">
            <a href="${resetLink}" 
              style="
                display:inline-block;
                padding:14px 32px;
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                color:#ffffff;
                font-size:15px;
                font-weight:600;
                border-radius:10px;
                text-decoration:none;
                box-shadow:0 6px 18px rgba(37, 99, 235, 0.3);
              ">
              Reset Password
            </a>
          </div>

          <p style="font-size:14px; color:#64748b; line-height:1.6;">
            This link will expire in <strong>15 minutes</strong>. For your security, do not share it with anyone.
          </p>

          <p style="font-size:14px; color:#64748b;">
            If you didn’t request this, you can safely ignore this email.
          </p>

          <hr style="margin:30px 0; border:none; border-top:1px solid #e2e8f0;" />

          <p style="
            font-size:12px;
            color:#94a3b8;
            text-align:center;
            margin:0;
          ">
            © ${new Date().getFullYear()} Compiece. All rights reserved.
          </p>

        </div>
      </div>

    </div>
  </div>
  `;

  const text = `
Compiece – Reset Your Password

We received a request to reset your password.

Reset link (valid for 15 minutes):
${resetLink}

If you did not request this, please ignore this email.

© ${new Date().getFullYear()} Compiece
`;

  await sendEmail(to, subject, html, text);
}