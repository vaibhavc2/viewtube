import { LikeController } from "@/controllers/like/like.controller";
import { middlewares } from "@/middlewares";
import { Router } from "express";

class LikeRouter {
  public router: Router;
  public controller: LikeController;

  constructor() {
    this.router = Router();
    this.controller = new LikeController();
    this.routes();
  }

  public routes() {
    this.router.get(
      "/get-count",
      middlewares.validation.ids,
      this.controller.getLikesCount
    );

    // the routes below require authentication
    this.router.use(middlewares.auth.user);

    this.router.post(
      "/add",
      middlewares.validation.ids,
      this.controller.addLike
    );
    this.router.delete(
      "/remove",
      middlewares.validation.ids,
      this.controller.removeLike
    );
    this.router.get("/get-history", this.controller.getLikeHistory);
  }
}

export const likesRouter = new LikeRouter().router;
