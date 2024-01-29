import { AppHealthController } from "@/controllers/app-health/app-health.controller";
import { Router } from "express";

class AppHealthRouter {
  public router: Router;
  public controller: AppHealthController;

  constructor() {
    this.router = Router();
    this.controller = new AppHealthController();
    this.routes();
  }

  public routes() {
    this.router.get("/test", this.controller.testAppHealth);
    this.router.get("/health", this.controller.testAppHealth);
  }
}

export default new AppHealthRouter().router;
