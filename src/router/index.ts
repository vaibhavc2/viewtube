import { __prefix_api_version } from "@/constants/express";
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
    this.router.use(`${__prefix_api_version}/users`, usersRouter);
    this.router.use(`${__prefix_api_version}/videos`, videosRouter);
    this.router.use(
      `${__prefix_api_version}/subscriptions`,
      subscriptionsRouter
    );
    this.router.use(`${__prefix_api_version}/tweets`, tweetsRouter);
    this.router.use(`${__prefix_api_version}/likes`, likesRouter);
    this.router.use(`${__prefix_api_version}/comments`, commentsRouter);
    this.router.use(`${__prefix_api_version}/playlists`, playlistsRouter);
    this.router.use(`${__prefix_api_version}/dashboard`, dashboardRouter);

    // admin routes
    this.router.use(`${__prefix_api_version}/admin`, adminRouter);

    // app health route
    this.router.use(`${__prefix_api_version}`, appHealthRouter);
  }
}

export const appRouter = new AppRouter().router;
