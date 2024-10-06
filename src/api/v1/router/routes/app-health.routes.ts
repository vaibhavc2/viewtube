import { AppHealthController } from "@/api/v1/controllers/app-health.controller";
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
    /**
     * @openapi
     * /health:
     *   get:
     *     tags:
     *       - Health
     *     summary: Check the health of the API - http, db, disk, memory
     *     description: Check the health of the API - http, db, disk, memory
     *     responses:
     *       200:
     *         description: Health check passed
     *       503:
     *         description: Health check failed
     */
    this.router.get("/", this.controller.testAppHealth);
  }
}

export const appHealthRouter = new AppHealthRouter().router;
