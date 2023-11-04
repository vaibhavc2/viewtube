import mongoose from "mongoose";
import { DB_NAME, MONGO_URI } from "../config/config.js";
import { printErrorMessage } from "../utils/error/error-message.js";

export const connectDB = async () => {
  const connectionInstance = await mongoose
    .connect(MONGO_URI, {
      dbName: DB_NAME,
    })
    .catch((error) => {
      printErrorMessage(error, " :: at connectDB()");
      process.exit(1);
    });

  if (connectionInstance) {
    console.log(
      `MongoDB Database connected successfully. DB HOST: ${connectionInstance.connection.host}`
    );
  }
};
