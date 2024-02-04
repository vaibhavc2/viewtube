import { App } from "@/app";
import { envConfig } from "@/config";
import { appConstants } from "@/constants";
import { database } from "@/database";
import { IUserModel } from "@/database/models/user.model";
import { wLogger } from "@/utils/logger.util";
import { printErrorMessage } from "@/utils/print-error-message.util";
import { Application } from "express";
import { Server as HttpServer } from "http";
import mongoose from "mongoose";
import url from "url";
import WebSocket from "ws";

class Server {
  private app: Application;
  private wss: WebSocket.Server;
  private userConnections: Map<string, WebSocket>;

  constructor() {
    // initializing express app for http server
    this.app = new App().init();

    // initializing websocket server: later upgrade http server to websocket server
    this.wss = new WebSocket.Server({ noServer: true });

    // initializing user connections
    this.userConnections = new Map();
  }

  public async init() {
    // global error handling
    this.globalErrorHandling();

    // app error handling
    this.appErrorHandling();

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
    // starting http server
    const server = this.httpServer();

    // starting websocket server
    this.webSocketServer(server);
  }

  private httpServer() {
    // starting http server
    const server = this.app.listen(envConfig.port(), () => {
      wLogger.info(
        `⚙️   Server is running at http://localhost:${envConfig.port()} in ${envConfig.nodeEnv()} mode.`
      );
    });

    return server;
  }

  private webSocketServer(server: HttpServer) {
    // Handle WebSocket connections: Upgrade HTTP server to WebSocket server
    this.handleWebSocketUpgrade(server);

    // Handle new WebSocket connections
    this.handleNewWebSocketConnections();
  }

  private handleWebSocketUpgrade(server: HttpServer) {
    // Upgrade HTTP server to WebSocket server
    server.on("upgrade", (request, socket, head) => {
      // Extract the pathname from the request URL
      const pathname = new URL(
        String(request.url),
        `http://${request.headers.host}`
      ).pathname;

      // Handle new WebSocket connections
      if (pathname === appConstants.webSocketRoutePath) {
        this.wss.handleUpgrade(request, socket, head, (ws) => {
          this.wss.emit("connection", ws, request);
        });
      } else {
        socket.destroy();
      }
    });
  }

  private async handleNewWebSocketConnections() {
    // Handle new WebSocket connections
    this.wss.on("connection", async (ws, request) => {
      try {
        // Parse the URL of the request to get the query parameters
        const parsedUrl = url.parse(String(request.url), true);

        // Get the userId from the query parameters
        const userId = String(parsedUrl.query.userId);

        // check if userId is present
        if (userId === "undefined") {
          wLogger.info(`⚠️  A connection attempt without userId!`);
          ws.close();
        }

        // check if userId is valid
        const userModel = (await this.app
          .get("connection")
          .model("User")) as IUserModel;
        const user = await userModel
          .findById(new mongoose.Types.ObjectId(userId))
          .select("_id");

        // if user is not found, close the connection
        if (user?._id !== userId) {
          wLogger.info(`⚠️  A connection attempt with invalid userId!`);
          ws.close();
        }

        // Save the connection
        this.userConnections.set(userId, ws);

        // Log the connection
        wLogger.info(`👤  A user connected! userId: ${userId}`);

        // Handle messages from the client
        ws.on("message", (message) => {
          wLogger.info(`📌  Received: ${message}`);
        });

        // Handle disconnections
        ws.on("close", () => {
          // Remove the connection
          this.userConnections.delete(userId);
          wLogger.info(`🔁  A user disconnected! userId: ${userId}`);
        });
      } catch (error) {
        printErrorMessage(
          error,
          "WebSocket error :: at handleNewWebSocketConnections() :: Server"
        );
      }
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
