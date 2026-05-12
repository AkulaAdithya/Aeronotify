import { Router } from "express";
import {
  getAllFlights,
  getFlightByNumber,
  createFlight,
  updateFlight,
  deleteFlight,
  trackFlight,
  untrackFlight,
} from "../controllers/flightController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", getAllFlights);
router.get("/:flightNumber", getFlightByNumber);

// Public — passenger subscribes/unsubscribes to a flight's alerts
router.post("/:flightId/track", trackFlight);
router.post("/:flightId/untrack", untrackFlight);

// Protected routes (admin only)
router.post("/", protect, createFlight);
router.put("/:id", protect, updateFlight);
router.delete("/:id", protect, deleteFlight);

export default router;
