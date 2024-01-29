import { DashboardController } from "@/controllers/dashboard/dashboard.controller";
import { verifyAuthentication } from "@/middlewares/auth/auth.middleware";
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
    this.router.use(verifyAuthentication);

    this.router.get("/videos", this.controller.getChannelVideos);
  }
}

export default new DashboardRouter().router;
