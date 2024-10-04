import envConfig from "@/common/env.config";
import { logger } from "@/common/utils/logger.util";
import { printErrorMessage } from "@/common/utils/print-error-message.util";
import mongoose from "mongoose";

const { MONGO_URI, DB_NAME } = envConfig;
class Database {
  public init() {
    // connecting to database
    return this.connectDB();
  }

  private connectDB() {
    const connectionInstance = mongoose.createConnection(MONGO_URI, {
      dbName: DB_NAME,
    });

    connectionInstance.on("error", (err) => {
      logger.error(
        printErrorMessage(
          err,
          "MONGODB Connection FAILED :: at connectDB() :: Database"
        )
      );
    });

    connectionInstance.on("disconnected", () => {
      logger.info("MONGODB Connection DISCONNECTED :: at connectDB()");
    });

    connectionInstance.once("open", () => {
      logger.info(
        `✅  MongoDB Database connected successfully!! DB HOST: ${connectionInstance.host}`
      );
    });

    return connectionInstance;
  }

  private connectDBAsync() {
    return new Promise<typeof mongoose>((resolve, reject) => {
      mongoose
        .connect(MONGO_URI, {
          dbName: DB_NAME,
        })
        .then((connectionInstance) => {
          logger.info(
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

const database = new Database();

export default database;
