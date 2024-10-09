import env from "@/common/env.config";
import { AdminController } from "@/api/v1/controllers/admin.controller";
import { Router } from "express";
import auth from "@/common/middlewares/auth.middleware";

class AdminRouter {
  public router: Router;
  public controller: AdminController;

  constructor() {
    this.router = Router();
    this.controller = new AdminController();
    this.routes();
  }

  public routes() {
    this.router.use(auth.user, auth.admin);

    // safety check: the environment must be development
    if (env.isDev) {
      // seed fake data: users, videos
      this.router.post("/db/seed/users", this.controller.seedFakeUsers);
      this.router.post(
        "/db/seed/videos/:userId",
        this.controller.seedFakeVideos
      );
    }

    /**
     * @openapi
     * /admin/users/{userId}/role:
     *   patch:
     *     tags: [Admin]
     *     summary: Change user role
     *     description: Change user role
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         type: string
     *         description: User ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *               type: object
     *               properties:
     *                   role:
     *                     type: string
     *                     description: User role
     *                     enum: [user, admin]
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    this.router.patch("/users/:userId/role", this.controller.changeRole);

    /**
     * @openapi
     * /admin/users/{userId}/status:
     *   patch:
     *     tags: [Admin]
     *     summary: Update user status
     *     description: Update user status
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         type: string
     *         description: User ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *               type: object
     *               properties:
     *                   status:
     *                     type: string
     *                     description: User status
     *                     enum: ["enabled", "disabled"]
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     * */
    this.router.patch(
      "/users/:userId/status",
      this.controller.updateUserStatus
    );

    /**
     * @openapi
     * /admin/users/{userId}:
     *   delete:
     *     tags: [Admin]
     *     summary: Delete user
     *     description: Delete user
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         type: string
     *         description: User ID
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    this.router.delete("/users/:userId", this.controller.deleteUser);
  }
}

export const adminRouter = new AdminRouter().router;
