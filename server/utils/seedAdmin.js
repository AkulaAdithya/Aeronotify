import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

// ─── Add your admin accounts here ───────────────────────────
const admins = [
  { email: "admin@aeronotify.com", password: "admin123" },
  { email: "controller@aeronotify.com", password: "controller123" },
  // Add more admins below:
  // { email: "newadmin@aeronotify.com", password: "securepass" },
];

const seedAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB for seeding\n");

    for (const admin of admins) {
      const existing = await Admin.findOne({ email: admin.email });
      if (existing) {
        console.log(`ℹ  ${admin.email} already exists — skipped.`);
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(admin.password, salt);
        await Admin.create({ email: admin.email, password: hashedPassword });
        console.log(`✅ Created: ${admin.email} / ${admin.password}`);
      }
    }

    console.log(`\n📋 Total admins in DB: ${await Admin.countDocuments()}`);
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedAdmins();
