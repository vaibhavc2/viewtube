import { DashboardController } from "@/api/v1/controllers/dashboard.controller";
import { Router } from "express";
import auth from "@/common/middlewares/auth.middleware";

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
    this.router.use(auth.user);

    this.router.get("/videos", this.controller.getChannelVideos);
  }
}

export const dashboardRouter = new DashboardRouter().router;
