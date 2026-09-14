import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

const seedAdmins = async () => {
  if (!adminEmail || !adminPassword) {
    console.error("❌ Seeding aborted: ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB for seeding\n");

    const existing = await Admin.findOne({ email: adminEmail.toLowerCase() });
    if (existing) {
      console.log(`ℹ  ${adminEmail} already exists — skipped.`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      await Admin.create({ email: adminEmail.toLowerCase(), password: hashedPassword });
      console.log(`✅ Created admin account: ${adminEmail}`);
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
