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

    /**
     * @openapi
     * /health/db:
     *   get:
     *     tags:
     *       - Health
     *     summary: Check the health of the database
     *     description: Check the health of the database
     *     responses:
     *       200:
     *         description: Health check passed
     *       503:
     *         description: Health check failed
     */
    this.router.get("/db", this.controller.testDbHealth);

    /**
     * @openapi
     * /health/disk:
     *   get:
     *     tags:
     *       - Health
     *     summary: Check the health of the disk
     *     description: Check the health of the disk
     *     responses:
     *       200:
     *         description: Health check passed
     *       503:
     *         description: Health check failed
     */
    this.router.get("/disk", this.controller.testDiskHealth);

    /**
     * @openapi
     * /health/memory:
     *   get:
     *     tags:
     *       - Health
     *     summary: Check the health of the memory
     *     description: Check the health of the memory
     *     responses:
     *       200:
     *         description: Health check passed
     *       503:
     *         description: Health check failed
     */
    this.router.get("/memory", this.controller.testMemoryHealth);

    /**
     * @openapi
     * /health/http:
     *   get:
     *     tags:
     *       - Health
     *     summary: Check the health of the http
     *     description: Check the health of the http
     *     responses:
     *       200:
     *         description: Health check passed
     *       503:
     *         description: Health check failed
     */
    this.router.get("/http", this.controller.testHttpHealth);

    /**
     * @openapi
     * /health/all:
     *   get:
     *     tags:
     *       - Health
     *     summary: Check the health of the all
     *     description: Check the health of the all
     *     responses:
     *       200:
     *         description: Health check passed
     *       503:
     *         description: Health check failed
     */
    this.router.get("/all", this.controller.testAppHealth);
  }
}

export const appHealthRouter = new AppHealthRouter().router;
