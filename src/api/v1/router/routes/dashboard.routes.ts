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
    /**
     * @openapi
     * /dashboard/{userId}:
     *   get:
     *     tags:
     *       - Dashboard
     *     summary: Get channel stats of a user
     *     description: Get channel stats of a user
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     */
    this.router.get("/:userId", this.controller.getChannelStats);

    // the routes below require authentication
    this.router.use(auth.user);

    /**
     * @openapi
     * /dashboard/videos:
     *   get:
     *     tags:
     *       - Dashboard
     *     summary: Get channel videos
     *     description: Get channel videos - private, public, published and unpublished
     *     parameters:
     *       - in: query
     *         name: page
     *         required: false
     *         type: string
     *       - in: query
     *         name: limit
     *         required: false
     *         type: string
     *       - in: query
     *         name: sortBy
     *         required: false
     *         type: string
     *       - in: query
     *         name: sortType
     *         required: false
     *         type: string
     *       - in: query
     *         name: query
     *         required: false
     *         type: string
     *       - in: query
     *         name: isPublished
     *         required: false
     *         type: number
     *       - in: query
     *         name: isPrivate
     *         required: false
     *         type: number
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     *     security:
     *       - Bearer: []
     */
    this.router.get("/videos", this.controller.getChannelVideos);
  }
}

export const dashboardRouter = new DashboardRouter().router;
