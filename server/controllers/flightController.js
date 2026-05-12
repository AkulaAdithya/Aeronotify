import Flight from "../models/Flight.js";
import Passenger from "../models/Passenger.js";
import { dispatchAlerts } from "../utils/emailService.js";
import { sendAlertEmail } from "../utils/sendEmail.js";

/**
 * @route   GET /api/flights
 * @desc    Get all flights sorted by departure time
 * @access  Public
 */
export const getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find().sort({ departureTime: 1 });
    res.json(flights);
  } catch (error) {
    console.error("Get flights error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route   GET /api/flights/:flightNumber
 * @desc    Get a single flight by flight number
 * @access  Public
 */
export const getFlightByNumber = async (req, res) => {
  try {
    const flight = await Flight.findOne({
      flightNumber: req.params.flightNumber.toUpperCase(),
    });

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    res.json(flight);
  } catch (error) {
    console.error("Get flight error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route   POST /api/flights
 * @desc    Create a new flight
 * @access  Admin (JWT protected)
 */
export const createFlight = async (req, res) => {
  try {
    const { flightNumber, airline, origin, destination, departureTime, arrivalTime, status, gate } = req.body;

    // Check for duplicate flight number
    const existing = await Flight.findOne({ flightNumber: flightNumber?.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: "Flight number already exists" });
    }

    const flight = await Flight.create({
      flightNumber,
      airline,
      origin,
      destination,
      departureTime,
      arrivalTime,
      status: status || "On Time",
      gate: gate || "--",
    });

    res.status(201).json({ message: "Flight created successfully", flight });
  } catch (error) {
    console.error("Create flight error:", error.message);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route   PUT /api/flights/:id
 * @desc    Update a flight — triggers email alerts on status/gate change
 * @access  Admin (JWT protected)
 */
export const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    // Capture old values for comparison
    const oldStatus = flight.status;
    const oldGate = flight.gate;

    // Apply updates
    const allowedFields = ["flightNumber", "airline", "origin", "destination", "departureTime", "arrivalTime", "status", "gate"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        flight[field] = req.body[field];
      }
    });

    await flight.save();

    // Determine what changed and dispatch alerts asynchronously
    const statusChanged = oldStatus !== flight.status;
    const gateChanged = oldGate !== flight.gate;

    if (statusChanged || gateChanged) {
      let changeType = "STATUS_CHANGE";
      if (gateChanged && !statusChanged) changeType = "GATE_CHANGE";
      if (flight.status === "Delayed") changeType = "DELAY";

      // Fire-and-forget — don't await, so the response isn't blocked
      dispatchAlerts(flight, changeType, { status: oldStatus, gate: oldGate }, Passenger).catch(
        (err) => console.error("Alert dispatch error:", err.message)
      );

      // Automated subscriber alerts for critical status changes (Delayed / Cancelled)
      if (
        statusChanged &&
        (flight.status === "Delayed" || flight.status === "Cancelled") &&
        flight.subscribers.length > 0
      ) {
        const autoSubject = `AeroNotify: Update for Flight ${flight.flightNumber}`;
        const autoMessage = `Attention: Your tracked flight ${flight.airline} ${flight.flightNumber} is now marked as ${flight.status}.`;

        // Fire-and-forget so the PUT response is not blocked
        sendAlertEmail(flight.subscribers, autoSubject, autoMessage).catch(
          (err) => console.error("Subscriber auto-alert error:", err.message)
        );
      }
    }

    res.json({ message: "Flight updated successfully", flight });
  } catch (error) {
    console.error("Update flight error:", error.message);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route   POST /api/flights/:flightId/track
 * @desc    Subscribe a passenger's email to a flight's alerts
 * @access  Public
 */
export const trackFlight = async (req, res) => {
  try {
    const { flightId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    // Check if already subscribed
    if (flight.subscribers.includes(email.toLowerCase())) {
      return res.status(200).json({ message: "You are already tracking this flight", flight });
    }

    flight.subscribers.push(email.toLowerCase());
    await flight.save();

    res.json({ message: `Now tracking flight ${flight.flightNumber}`, flight });
  } catch (error) {
    console.error("Track flight error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route   POST /api/flights/:flightId/untrack
 * @desc    Unsubscribe a passenger's email from a flight's alerts
 * @access  Public
 */
export const untrackFlight = async (req, res) => {
  try {
    const { flightId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    flight.subscribers = flight.subscribers.filter(
      (e) => e !== email.toLowerCase()
    );
    await flight.save();

    res.json({ message: `Stopped tracking flight ${flight.flightNumber}`, flight });
  } catch (error) {
    console.error("Untrack flight error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route   DELETE /api/flights/:id
 * @desc    Delete a flight
 * @access  Admin (JWT protected)
 */
export const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    // Also remove all passenger subscriptions for this flight
    await Passenger.deleteMany({ flightNumber: flight.flightNumber });

    res.json({ message: "Flight deleted successfully" });
  } catch (error) {
    console.error("Delete flight error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
