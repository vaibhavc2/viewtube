import { FRONTEND_URI, NODE_ENV } from "@/config/config";
import { __limit, __prefix_api_version } from "@/constants/express";
import { errorHandler } from "@/middlewares/error/error-handler.middleware";
import { errorLogger } from "@/middlewares/error/error-logger.middleware";
import { routeNotFound } from "@/middlewares/error/route-not-found.middleware";
import adminRouter from "@/routes/admin.routes";
import appHealthRouter from "@/routes/app-health.routes";
import commentsRouter from "@/routes/comments.routes";
import dashboardRouter from "@/routes/dashboard.routes";
import likesRouter from "@/routes/likes.routes";
import playlistsRouter from "@/routes/playlists.routes";
import subscriptionsRouter from "@/routes/subscriptions.routes";
import tweetsRouter from "@/routes/tweets.routes";
import usersRouter from "@/routes/users.routes";
import videosRouter from "@/routes/videos.routes";
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
    this.useRoutes();

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
        origin: [FRONTEND_URI],
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
    if (NODE_ENV === "development") this.app.use(morgan("combined"));
  }

  private useRoutes() {
    // using routes
    this.app.use(`${__prefix_api_version}/users`, usersRouter);
    this.app.use(`${__prefix_api_version}/videos`, videosRouter);
    this.app.use(`${__prefix_api_version}/subscriptions`, subscriptionsRouter);
    this.app.use(`${__prefix_api_version}/tweets`, tweetsRouter);
    this.app.use(`${__prefix_api_version}/likes`, likesRouter);
    this.app.use(`${__prefix_api_version}/comments`, commentsRouter);
    this.app.use(`${__prefix_api_version}/playlists`, playlistsRouter);
    this.app.use(`${__prefix_api_version}/dashboard`, dashboardRouter);

    // admin routes
    this.app.use(`${__prefix_api_version}/admin`, adminRouter);

    // app health route
    this.app.use(`${__prefix_api_version}`, appHealthRouter);
  }

  private useErrorHandlers() {
    // error handler middlewares
    this.app.use(errorLogger, errorHandler, routeNotFound);
  }
}
