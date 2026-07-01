import mongoose from "mongoose";
import foodModel from "../models/foodModel.js";
import { defaultFoods } from "./seedData.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 3000 });
    console.log("DB Connected to MongoDB Atlas");
    global.useLocalDB = false;
    
    // Seed default food items if empty
    const count = await foodModel.countDocuments();
    if (count === 0) {
      console.log("Database is empty. Seeding default food items...");
      await foodModel.insertMany(defaultFoods);
      console.log("Database successfully seeded with default food items.");
    } else {
      console.log(`Database already contains ${count} food items.`);
    }
    console.log("🟢 [Ready] MongoDB Atlas is active and listening for requests!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error Details:", err.message || err);
    console.warn("MongoDB Atlas connection failed. Switching to Local File Database.");
    global.useLocalDB = true;
    console.log("🟢 [Ready] Local File Database is active and listening for requests!");
  }
};
