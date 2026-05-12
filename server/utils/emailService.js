import nodemailer from "nodemailer";

/**
 * Create a reusable Nodemailer transporter with Google SMTP.
 * Credentials are read from environment variables.
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
 * Send a flight alert email to a passenger.
 *
 * @param {string}  passengerEmail - Recipient email
 * @param {Object}  flight         - The updated flight document
 * @param {string}  changeType     - "STATUS_CHANGE" | "GATE_CHANGE" | "DELAY"
 * @param {Object}  oldValues      - Previous values { status, gate } before update
 */
export const sendFlightAlert = async (passengerEmail, flight, changeType, oldValues = {}) => {
  const transporter = createTransporter();

  const changeDescriptions = {
    STATUS_CHANGE: `Status changed from <strong>${oldValues.status || "N/A"}</strong> to <strong>${flight.status}</strong>`,
    GATE_CHANGE: `Gate changed from <strong>${oldValues.gate || "N/A"}</strong> to <strong>${flight.gate}</strong>`,
    DELAY: `Flight has been <strong>delayed</strong>. New status: <strong>${flight.status}</strong>`,
  };

  const departureStr = new Date(flight.departureTime).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

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
        .alert-badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 6px 14px; border-radius: 20px; font-weight: 600; font-size: 13px; margin-bottom: 16px; }
        .flight-info { background: #f8fafc; border-radius: 8px; padding: 18px; margin: 16px 0; border-left: 4px solid #3b82f6; }
        .flight-info p { margin: 6px 0; font-size: 14px; }
        .flight-info .label { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .change { font-size: 15px; line-height: 1.6; margin: 12px 0; }
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
          <span class="alert-badge">⚠ Flight Update</span>
          <div class="change">${changeDescriptions[changeType] || "A change has been made to your flight."}</div>
          <div class="flight-info">
            <p><span class="label">Flight</span><br/><strong>${flight.flightNumber}</strong> — ${flight.airline}</p>
            <p><span class="label">Route</span><br/>${flight.origin} → ${flight.destination}</p>
            <p><span class="label">Departure</span><br/>${departureStr}</p>
            <p><span class="label">Gate</span><br/><strong>${flight.gate}</strong></p>
            <p><span class="label">Status</span><br/><strong>${flight.status}</strong></p>
          </div>
          <p style="font-size:13px; color:#64748b;">Please check with your airline for the most up-to-date information.</p>
        </div>
        <div class="footer">
          You are receiving this email because you subscribed to updates for flight ${flight.flightNumber} on AeroNotify.
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"AeroNotify ✈" <${process.env.EMAIL_USER}>`,
    to: passengerEmail,
    subject: `✈ Flight ${flight.flightNumber} — ${changeType.replace("_", " ")} Alert`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Alert sent to ${passengerEmail} for flight ${flight.flightNumber}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${passengerEmail}:`, error.message);
  }
};

/**
 * Dispatch alerts to ALL subscribers of a given flight.
 * Runs asynchronously (fire-and-forget) so the caller is not blocked.
 *
 * @param {Object} flight      - Updated flight document (includes subscribers array)
 * @param {string} changeType  - Type of change
 * @param {Object} oldValues   - Previous values before update
 * @param {Model}  Passenger   - Mongoose Passenger model (unused, kept for API compat)
 */
export const dispatchAlerts = async (flight, changeType, oldValues, Passenger) => {
  try {
    const subscriberEmails = flight.subscribers || [];

    if (subscriberEmails.length === 0) {
      console.log(`ℹ No subscribers for flight ${flight.flightNumber} — no emails sent.`);
      return;
    }

    console.log(`📨 Dispatching ${subscriberEmails.length} alert(s) for flight ${flight.flightNumber}...`);

    // Send all emails concurrently
    const emailPromises = subscriberEmails.map((email) =>
      sendFlightAlert(email, flight, changeType, oldValues)
    );

    await Promise.allSettled(emailPromises);
    console.log(`✅ All alerts dispatched for flight ${flight.flightNumber}`);
  } catch (error) {
    console.error(`❌ Error dispatching alerts:`, error.message);
  }
};
