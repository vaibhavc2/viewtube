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

export const app: Application = express();

// using pre-built middlewares
app.use(
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
if (NODE_ENV === "development") app.use(morgan("combined"));

// using routes
app.use(`${__prefix_api_version}/users`, usersRouter);
app.use(`${__prefix_api_version}/videos`, videosRouter);
app.use(`${__prefix_api_version}/subscriptions`, subscriptionsRouter);
app.use(`${__prefix_api_version}/tweets`, tweetsRouter);
app.use(`${__prefix_api_version}/likes`, likesRouter);
app.use(`${__prefix_api_version}/comments`, commentsRouter);
app.use(`${__prefix_api_version}/playlists`, playlistsRouter);
app.use(`${__prefix_api_version}/dashboard`, dashboardRouter);

// admin routes
app.use(`${__prefix_api_version}/admin`, adminRouter);

// app health route
app.use(`${__prefix_api_version}`, appHealthRouter);

// error handler middlewares
app.use(errorLogger, errorHandler, routeNotFound);
