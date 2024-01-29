import { App } from "@/app";
import { envConfig } from "@/config";
import { database } from "@/database";
import { wLogger } from "@/utils/log/logger.util";
import { printErrorMessage } from "@/utils/server/error/print-error-message.util";
import { Application } from "express";

class Server {
  private app: Application;

  constructor() {
    // initializing express app
    this.app = new App().init();
  }

  public async init() {
    // global error handling
    this.globalErrorHandling();

    // initializing server
    await this.initServer();
  }

  private async initServer() {
    try {
      // connecting to database
      const connection = await database.init();

      // adding connection to express app
      this.app.set("connection", connection);

      // starting server
      this.startServer();

      // error handling for server
    } catch (error) {
      this.serverErrorHandling(error);
    }
  }

  private startServer() {
    // app error handling
    this.appErrorHandling();

    // starting server
    this.app.listen(envConfig.port(), () => {
      wLogger.info(
        `⚙️   Server is running at http://localhost:${envConfig.port()} in ${envConfig.nodeEnv()} mode.`
      );
    });
  }

  private appErrorHandling() {
    this.app.on("error", (error) => {
      printErrorMessage(
        error,
        "EXPRESS Server FAILED :: at app.on() :: appErrorHandling() :: Server"
      );

      process.exit(1);
    });
  }

  private serverErrorHandling = (error: unknown) => {
    // error handling for server
    printErrorMessage(
      error,
      "EXPRESS Server FAILED :: at initServer() :: Server"
    );

    process.exit(1);
  };

  private globalErrorHandling() {
    process.on("uncaughtException", (error) => {
      printErrorMessage(
        error,
        "EXPRESS Server FAILED :: at process.on() :: globalErrorHandling() :: Server"
      );

      process.exit(1);
    });
  }
}

export const server = new Server();
