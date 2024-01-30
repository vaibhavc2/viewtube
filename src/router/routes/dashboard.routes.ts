import { DashboardController } from "@/controllers/dashboard/dashboard.controller";
import { middlewares } from "@/middlewares";
import { Router } from "express";

class DashboardRouter {
  public router: Router;
  public controller: DashboardController;

  constructor() {
    this.router = Router();
    this.controller = new DashboardController();
    this.routes();
  }

  public routes() {
    this.router.get("/:userId/channel-stats", this.controller.getChannelStats);

    // the routes below require authentication
    this.router.use(middlewares.auth.user);

    this.router.get("/videos", this.controller.getChannelVideos);
  }
}

export const dashboardRouter = new DashboardRouter().router;
