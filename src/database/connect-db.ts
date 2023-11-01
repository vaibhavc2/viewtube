import mongoose from "mongoose";
import { MONGO_URI } from "../config/config.js";
import { printErrorMessage } from "../utils/error/error-message.js";

export const connectDB = async () => {
  const connect = await mongoose
    .connect(MONGO_URI, {
      dbName: "jalandhar-02"
    })
    .catch((error) => {
      printErrorMessage(error, " :: at connectDB()");
    });

  if (connect) {
    console.log(
      `Database connected successfully with host: ${connect.connection.host}`
    );
  }
};
