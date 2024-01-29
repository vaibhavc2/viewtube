import { CommentController } from "@/controllers/comment/comment.controller";
import { verifyAuthentication } from "@/middlewares/auth/auth.middleware";
import { validateIds } from "@/middlewares/validation/id-validation.middleware";
import { Router } from "express";

class CommentRouter {
  public router: Router;
  public controller: CommentController;

  constructor() {
    this.router = Router();
    this.controller = new CommentController();
    this.routes();
  }

  public routes() {
    this.router.get("/get-comments", validateIds, this.controller.getComments);

    // the routes below require authentication
    this.router.use(verifyAuthentication);

    this.router.get("/get-history", this.controller.getCommentHistory);
    this.router.post("/add-comment", validateIds, this.controller.addComment);
    this.router.patch("/:commentId/update", this.controller.updateComment);
    this.router.delete("/:commentId/delete", this.controller.deleteComment);
  }
}

export const commentsRouter = new CommentRouter().router;
