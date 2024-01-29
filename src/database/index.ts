import { DB_NAME, MONGO_URI } from "@/config/config";
import { wLogger } from "@/utils/log/logger.util";
import { printErrorMessage } from "@/utils/server/error/print-error-message.util";
import mongoose from "mongoose";

class Database {
  constructor() {}

  public async init() {
    // connecting to database
    return await this.connectDB();
  }

  private connectDB() {
    return new Promise<typeof mongoose>((resolve, reject) => {
      mongoose
        .connect(MONGO_URI, {
          dbName: DB_NAME,
        })
        .then((connectionInstance) => {
          wLogger.info(
            `✅  MongoDB Database connected successfully!! DB HOST: ${connectionInstance.connection.host}`
          );
          resolve(connectionInstance);
        })
        .catch((error) => {
          printErrorMessage(
            error,
            "MONGODB Connection FAILED :: at connectDB() :: Database"
          );
          reject(error);
        });
    });
  }
}

export const database = new Database();
