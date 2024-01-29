import { LikeController } from "@/controllers/like/like.controller";
import { verifyAuthentication } from "@/middlewares/auth/auth.middleware";
import { validateIds } from "@/middlewares/validation/id-validation.middleware";
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
    this.router.get("/get-count", validateIds, this.controller.getLikesCount);

    // the routes below require authentication
    this.router.use(verifyAuthentication);

    this.router.post("/add", validateIds, this.controller.addLike);
    this.router.delete("/remove", validateIds, this.controller.removeLike);
    this.router.get("/get-history", this.controller.getLikeHistory);
  }
}

export default new LikeRouter().router;
