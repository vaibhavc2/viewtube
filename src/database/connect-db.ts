import { DB_NAME, MONGO_URI } from "@/config/config";
import { wLogger } from "@/utils/log/logger.util";
import { printErrorMessage } from "@/utils/server/error/print-error-message.util";
import mongoose from "mongoose";

export const connectDB = async () => {
  const connectionInstance = await mongoose
    .connect(MONGO_URI, {
      dbName: DB_NAME,
    })
    .catch((error) => {
      printErrorMessage(error, "MONGODB Connection FAILED :: at connectDB()");
      process.exit(1);
    });

  if (connectionInstance) {
    wLogger.info(
      `✅  MongoDB Database connected successfully!! DB HOST: ${connectionInstance.connection.host}`
    );
  }
};
