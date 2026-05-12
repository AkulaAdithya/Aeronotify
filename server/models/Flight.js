import mongoose from "mongoose";

const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: [true, "Flight number is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    airline: {
      type: String,
      required: [true, "Airline name is required"],
      trim: true,
    },
    origin: {
      type: String,
      required: [true, "Origin is required"],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    departureTime: {
      type: Date,
      required: [true, "Departure time is required"],
    },
    arrivalTime: {
      type: Date,
      required: [true, "Arrival time is required"],
    },
    status: {
      type: String,
      enum: ["On Time", "Delayed", "Cancelled", "Boarding", "Departed", "Landed"],
      default: "On Time",
    },
    gate: {
      type: String,
      default: "--",
      trim: true,
    },
    subscribers: [{ type: String }],
  },
  { timestamps: true }
);

const Flight = mongoose.model("Flight", flightSchema);
export default Flight;
