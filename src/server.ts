import { Application } from "express";
import { IncomingMessage, Server, ServerResponse } from "http";
import { App } from "./app";
import env from "@/common/env.config";
import ct from "@/common/constants";
import { logger } from "@/common/utils/logger.util";
import mongoose from "mongoose";
import database from "@/common/database";

const { PORT, NODE_ENV, isDev, isProd } = env;

type ExpressServer = Server<typeof IncomingMessage, typeof ServerResponse>;

class HTTPServer {
  private readonly app: Application;
  private server: ExpressServer;
  private connection: mongoose.Connection;

  // bootstrap the express application and server
  constructor(appInstance: App) {
    this.app = appInstance.init();

    this.connection = database.connect();

    // adding connection to express app
    this.app.set("connection", this.connection);

    this.server = this.app.listen(PORT, () => {
      logger.info(`Express Server started successfully in ${NODE_ENV} mode.`);

      if (isDev) {
        logger.info(`API available at '${ct.base_url}'`);
        logger.info(`Swagger UI available at '${ct.base_url}/api-docs'`);
      }
    });

    // Graceful shutdown in case of SIGINT (Ctrl+C) or SIGTERM (Docker)
    if (isProd) {
      process.on("SIGINT", this.gracefulShutdown.bind(null, 5000));
      process.on("SIGTERM", this.gracefulShutdown.bind(null, 5000));
    }
  }

  gracefulShutdown(
    waitTime: number = 5000 // Default wait time of 5 seconds
  ) {
    console.debug("\nSignal received: closing HTTP server...");

    // Stop accepting new connections
    this.server.close(async () => {
      console.debug("HTTP server closed gracefully.");

      try {
        await this.connection.close();
        // await redis.quit(); // Close Redis connection

        // await prisma.$disconnect(); // Close Prisma connection

        logger.debug("Connections closed successfully.");
      } catch (error) {
        logger.error("Error while closing connections: " + error);
      }
    });

    // Wait for ongoing requests to finish with a timeout
    setTimeout(() => {
      console.debug(
        `Waiting for ${waitTime / 1000} seconds for ongoing requests to complete...`
      );
      // Optionally, forcefully terminate remaining connections here
    }, waitTime);
  }
}

const appInstance = new App();
new HTTPServer(appInstance);
