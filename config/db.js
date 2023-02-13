// MongoDB Connection
import mongoose from "mongoose";
import dotenv from "dotenv";
import winstonLogger from "../utils/winstonLogger.js";

dotenv.config();

const connectDB = async () => {
  if (process.env.NODE_ENV === "production") {
    const dBUri = process.env.MONGO_URI.replace(
      "<password>",
      process.env.DATABASE_PASSWORD
    );

    try {
      const conn = await mongoose.connect(dBUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      winstonLogger.info(
        `MongoDB Connected to Production DB: ${conn.connection.host}`
      );
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  } else {
    try {
      const conn = await mongoose.connect(process.env.LOCAL_MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      winstonLogger.info(
        `MongoDB Connected to Local DB: ${conn.connection.name}`
      );
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
