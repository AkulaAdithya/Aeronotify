import { Router } from "express";
import { sendAlert } from "../controllers/alertController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

// Protected — admin sends alert emails
router.post("/send", protect, sendAlert);

export default router;
