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

class ApiV1Router {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    // using routes
    this.router.use(`/users`, usersRouter);
    this.router.use(`/videos`, videosRouter);
    this.router.use(`/subscriptions`, subscriptionsRouter);
    this.router.use(`/tweets`, tweetsRouter);
    this.router.use(`/likes`, likesRouter);
    this.router.use(`/comments`, commentsRouter);
    this.router.use(`/playlists`, playlistsRouter);
    this.router.use(`/dashboard`, dashboardRouter);

    // admin routes
    this.router.use(`/admin`, adminRouter);

    // app health route
    this.router.use(`/health`, appHealthRouter);
  }
}

const apiV1Router = new ApiV1Router().router;
export default apiV1Router;
