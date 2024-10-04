import { LikeController } from "@/api/v1/controllers/like.controller";
import auth from "@/common/middlewares/auth.middleware";
import validation from "@/common/middlewares/validation.middleware";
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
      validation.ids,
      this.controller.getLikesCount
    );

    // the routes below require authentication
    this.router.use(auth.user);

    this.router.post("/add", validation.ids, this.controller.addLike);
    this.router.delete("/remove", validation.ids, this.controller.removeLike);
    this.router.get("/get-history", this.controller.getLikeHistory);
  }
}

export const likesRouter = new LikeRouter().router;
