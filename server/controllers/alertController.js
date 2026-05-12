import { sendAlertEmail } from "../utils/sendEmail.js";
import Flight from "../models/Flight.js";

/**
 * @route   POST /api/alerts/send
 * @desc    Send a targeted email alert to all subscribers of a specific flight
 * @access  Admin (JWT protected)
 */
export const sendAlert = async (req, res) => {
  try {
    const { flightId, subject, message } = req.body;

    if (!flightId) {
      return res.status(400).json({ message: "flightId is required" });
    }
    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required" });
    }

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    if (!flight.subscribers || flight.subscribers.length === 0) {
      return res.status(400).json({ message: "No passengers are currently tracking this flight" });
    }

    const { sent, failed } = await sendAlertEmail(flight.subscribers, subject, message);

    res.json({
      message: `Alert dispatched for flight ${flight.flightNumber}: ${sent} sent, ${failed} failed`,
      sent,
      failed,
      totalRecipients: flight.subscribers.length,
    });
  } catch (error) {
    console.error("Send alert error:", error.message);
    res.status(500).json({ message: "Failed to send alerts" });
  }
};
