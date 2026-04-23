import { sendEmail } from "./sendEmail.js";

export async function sendOtpEmail(to: string, otp: string) {
  const subject = "Compiece – Your Verification Code";

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
            Verification Code
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
            Use the OTP below to complete your verification process.
          </p>

          <div style="text-align:center; margin:30px 0;">
            <div style="
              display:inline-block;
              padding:16px 32px;
              background: linear-gradient(135deg, #2563eb, #1d4ed8);
              color:#ffffff;
              font-size:22px;
              font-weight:700;
              border-radius:12px;
              letter-spacing:4px;
              box-shadow:0 6px 18px rgba(37, 99, 235, 0.3);
            ">
              ${otp}
            </div>
          </div>

          <p style="font-size:14px; color:#64748b; line-height:1.6;">
            This code will expire in <strong>5 minutes</strong>.  
            Never share your OTP with anyone.
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
Compiece – Verification Code

Your OTP is: ${otp}

This code is valid for 5 minutes. Do not share it with anyone.

If you did not request this, please ignore this email.

© ${new Date().getFullYear()} Compiece
  `;

  await sendEmail(to, subject, html, text);
}