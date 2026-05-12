import { Router } from "express";
import { registerPassenger, loginPassenger, getAllPassengers } from "../controllers/passengerController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

// Public — passenger creates an account
router.post("/register", registerPassenger);

// Public — passenger logs in
router.post("/login", loginPassenger);

// Protected — admin views all passengers
router.get("/", protect, getAllPassengers);

export default router;
