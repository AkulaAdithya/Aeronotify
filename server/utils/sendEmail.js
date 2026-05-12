import nodemailer from "nodemailer";

/**
 * Create a reusable Nodemailer transporter with Google SMTP.
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send a custom alert email to a list of passengers.
 *
 * @param {string[]} emails  - Array of recipient emails
 * @param {string}   subject - Email subject line
 * @param {string}   message - Plain text message body
 * @returns {Object}         - { sent, failed } counts
 */
export const sendAlertEmail = async (emails, subject, message) => {
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4f8; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e40af 100%); padding: 28px 32px; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; letter-spacing: 1px; }
        .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.85; }
        .body { padding: 28px 32px; color: #1e293b; }
        .alert-badge { display: inline-block; background: #dbeafe; color: #1e40af; padding: 6px 14px; border-radius: 20px; font-weight: 600; font-size: 13px; margin-bottom: 16px; }
        .message { font-size: 15px; line-height: 1.7; color: #334155; background: #f8fafc; border-radius: 8px; padding: 18px; border-left: 4px solid #3b82f6; margin: 16px 0; white-space: pre-wrap; }
        .footer { padding: 20px 32px; background: #f8fafc; text-align: center; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✈ AeroNotify</h1>
          <p>Flight Alert Notification</p>
        </div>
        <div class="body">
          <span class="alert-badge">📢 ${subject}</span>
          <div class="message">${message}</div>
        </div>
        <div class="footer">
          This email was sent by AeroNotify — Real-time Flight Tracking & Alerts.
        </div>
      </div>
    </body>
    </html>
  `;

  let sent = 0;
  let failed = 0;

  // Send individually so one failure doesn't block others
  const results = await Promise.allSettled(
    emails.map((email) =>
      transporter.sendMail({
        from: `"AeroNotify ✈" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `✈ AeroNotify — ${subject}`,
        html: htmlContent,
      })
    )
  );

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      sent++;
      console.log(`📧 Alert sent to ${emails[i]}`);
    } else {
      failed++;
      console.error(`❌ Failed to send to ${emails[i]}:`, result.reason.message);
    }
  });

  return { sent, failed };
};
