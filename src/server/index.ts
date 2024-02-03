import { App } from "@/app";
import { envConfig } from "@/config";
import { appConstants } from "@/constants";
import { database } from "@/database";
import { wLogger } from "@/utils/logger.util";
import { printErrorMessage } from "@/utils/print-error-message.util";
import { Application } from "express";
import { Server as HttpServer } from "http";
import WebSocket from "ws";

class Server {
  private app: Application;
  private wss: WebSocket.Server;

  constructor() {
    // initializing express app for http server
    this.app = new App().init();

    // initializing websocket server: later upgrade http server to websocket server
    this.wss = new WebSocket.Server({ noServer: true });
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

  private handleNewWebSocketConnections() {
    // Handle new WebSocket connections
    this.wss.on("connection", (ws) => {
      wLogger.info(`👤  A user connected!`);

      // Handle messages from the client
      ws.on("message", (message) => {
        wLogger.info(`📌  Received: ${message}`);
      });

      // Handle disconnections
      ws.on("close", () => {
        wLogger.info("🔁  A user disconnected!");
      });

      // Send a message to the client
      ws.send(
        "👋   Hello from server! Server time is " + new Date().toLocaleString()
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
