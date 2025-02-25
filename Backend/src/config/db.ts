import mongoose from "mongoose";
import config from ".";

const connectDB = async () => {
  try {
    if (!config.database_url) {
      throw new Error("Database URL is not defined");
    }
    const conn = await mongoose.connect(config.database_url);
  } catch {
    process.exit(1);
  }
};

export default connectDB;
