import { envConfig } from "@/config";
import { __limit } from "@/constants/express";
import { errorHandler } from "@/middlewares/error/error-handler.middleware";
import { errorLogger } from "@/middlewares/error/error-logger.middleware";
import { routeNotFound } from "@/middlewares/error/route-not-found.middleware";
import { appRouter } from "@/router";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import morgan from "morgan";

export class App {
  public app: Application;

  constructor() {
    // creating express app
    this.app = express();
  }

  public init() {
    // initializing express app
    this.initExpressApp();

    // returning express app
    return this.app;
  }

  private initExpressApp() {
    // setting express app variables
    this.setExpressAppVariables();

    // using pre-built middlewares
    this.usePreBuiltMiddlewares();

    // using routes
    this.app.use(appRouter);

    // error handler middlewares
    this.useErrorHandlers();
  }

  private setExpressAppVariables() {
    // setting express app variables
    this.app.set("trust proxy", true);
  }

  private usePreBuiltMiddlewares() {
    // using pre-built middlewares
    this.app.use(
      cors({
        origin: [envConfig.frontendUri()],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
      }),
      cookieParser(),
      express.json({
        limit: __limit,
      }),
      express.urlencoded({ extended: true, limit: __limit }),
      express.static("public")
    );

    // logs requests in development mode
    if (envConfig.isDev()) this.app.use(morgan("combined"));
  }

  private useErrorHandlers() {
    // error handler middlewares
    this.app.use(errorLogger, errorHandler, routeNotFound);
  }
}
