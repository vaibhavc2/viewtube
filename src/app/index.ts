import { envConfig } from "@/config";
import { appConstants } from "@/constants";
import { middlewares } from "@/middlewares";
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
        limit: appConstants.expressLimit,
      }),
      express.urlencoded({ extended: true, limit: appConstants.expressLimit }),
      express.static("public")
    );

    // logs requests in development mode
    if (envConfig.isDev()) this.app.use(morgan("combined"));
  }

  private useErrorHandlers() {
    // error handler middlewares
    this.app.use(
      middlewares.error.logger,
      middlewares.error.handler,
      middlewares.error.routeNotFound
    );
  }
}
