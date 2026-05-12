import bcrypt from "bcryptjs";
import Passenger from "../models/Passenger.js";

/**
 * @route   POST /api/passengers/register
 * @desc    Register a new passenger account
 * @access  Public
 */
export const registerPassenger = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required (name, phone, email, password)" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if email is already registered
    const existing = await Passenger.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const passenger = await Passenger.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Account created successfully",
      passenger: {
        id: passenger._id,
        name: passenger.name,
        email: passenger.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }
    console.error("Register passenger error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route   POST /api/passengers/login
 * @desc    Login a passenger
 * @access  Public
 */
export const loginPassenger = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const passenger = await Passenger.findOne({ email: email.toLowerCase() });
    if (!passenger) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, passenger.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      passenger: {
        id: passenger._id,
        name: passenger.name,
        email: passenger.email,
      },
    });
  } catch (error) {
    console.error("Login passenger error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route   GET /api/passengers
 * @desc    Get all passengers (admin only)
 * @access  Admin (JWT protected)
 */
export const getAllPassengers = async (req, res) => {
  try {
    const passengers = await Passenger.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ count: passengers.length, passengers });
  } catch (error) {
    console.error("Get passengers error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
