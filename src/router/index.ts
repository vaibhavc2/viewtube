import { appConstants } from "@/constants";
import { Router } from "express";
import { adminRouter } from "./routes/admin.routes";
import { appHealthRouter } from "./routes/app-health.routes";
import { commentsRouter } from "./routes/comments.routes";
import { dashboardRouter } from "./routes/dashboard.routes";
import { likesRouter } from "./routes/likes.routes";
import { playlistsRouter } from "./routes/playlists.routes";
import { subscriptionsRouter } from "./routes/subscriptions.routes";
import { tweetsRouter } from "./routes/tweets.routes";
import { usersRouter } from "./routes/users.routes";
import { videosRouter } from "./routes/videos.routes";

class AppRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    // using routes
    this.router.use(`${appConstants.prefixApiVersion}/users`, usersRouter);
    this.router.use(`${appConstants.prefixApiVersion}/videos`, videosRouter);
    this.router.use(
      `${appConstants.prefixApiVersion}/subscriptions`,
      subscriptionsRouter
    );
    this.router.use(`${appConstants.prefixApiVersion}/tweets`, tweetsRouter);
    this.router.use(`${appConstants.prefixApiVersion}/likes`, likesRouter);
    this.router.use(
      `${appConstants.prefixApiVersion}/comments`,
      commentsRouter
    );
    this.router.use(
      `${appConstants.prefixApiVersion}/playlists`,
      playlistsRouter
    );
    this.router.use(
      `${appConstants.prefixApiVersion}/dashboard`,
      dashboardRouter
    );

    // admin routes
    this.router.use(`${appConstants.prefixApiVersion}/admin`, adminRouter);

    // app health route
    this.router.use(`${appConstants.prefixApiVersion}`, appHealthRouter);
  }
}

export const appRouter = new AppRouter().router;
