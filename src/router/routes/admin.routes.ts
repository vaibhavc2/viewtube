import { envConfig } from "@/config";
import { AdminController } from "@/controllers/admin/admin.controller";
import { middlewares } from "@/middlewares";
import { Router } from "express";

class AdminRouter {
  public router: Router;
  public controller: AdminController;

  constructor() {
    this.router = Router();
    this.controller = new AdminController();
    this.routes();
  }

  public routes() {
    this.router.use(middlewares.auth.user, middlewares.auth.admin);

    // safety check: the environment must be development
    if (envConfig.isDev()) {
      // seed fake data: users, videos
      this.router.post("/db-seed/users", this.controller.seedFakeUsers);
      this.router.post(
        "/db-seed/videos/:userId",
        this.controller.seedFakeVideos
      );
    }

    this.router.patch("/change-role/user/:userId", this.controller.changeRole);
    this.router.delete("/delete/user/:userId", this.controller.deleteUser);
    this.router.patch("/disable/user/:userId", this.controller.disableUser);
    this.router.patch("/enable/user/:userId", this.controller.enableUser);
  }
}

export const adminRouter = new AdminRouter().router;
