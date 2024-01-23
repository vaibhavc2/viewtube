import { FRONTEND_URI, NODE_ENV } from "@/config/config";
import { __limit, __prefix_api_version } from "@/constants/express";
import { verifyAuthentication } from "@/middlewares/auth/auth.middleware";
import { errorHandler } from "@/middlewares/error/error-handler.middleware";
import { errorLogger } from "@/middlewares/error/error-logger.middleware";
import { routeNotFound } from "@/middlewares/error/route-not-found.middleware";
import appHealthRouter from "@/routes/app-health.routes";
import commentsRouter from "@/routes/comments.routes";
import likesRouter from "@/routes/likes.routes";
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
app.use(`${__prefix_api_version}/users`, verifyAuthentication, usersRouter);
app.use(`${__prefix_api_version}/videos`, verifyAuthentication, videosRouter);
app.use(
  `${__prefix_api_version}/subscriptions`,
  verifyAuthentication,
  subscriptionsRouter
);
app.use(`${__prefix_api_version}/tweets`, verifyAuthentication, tweetsRouter);
app.use(`${__prefix_api_version}/likes`, verifyAuthentication, likesRouter);
app.use(
  `${__prefix_api_version}/comments`,
  verifyAuthentication,
  commentsRouter
);

// app health route
app.use(`${__prefix_api_version}`, appHealthRouter);

// error handler middlewares
app.use(errorLogger, errorHandler, routeNotFound);
