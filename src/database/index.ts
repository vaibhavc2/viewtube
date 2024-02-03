import { envConfig } from "@/config";
import { wLogger } from "@/utils/logger.util";
import { printErrorMessage } from "@/utils/print-error-message.util";
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
        .connect(envConfig.mongoUri(), {
          dbName: envConfig.dbName(),
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
