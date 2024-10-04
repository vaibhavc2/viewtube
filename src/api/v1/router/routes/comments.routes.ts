import { CommentController } from "@/api/v1/controllers/comment.controller";
import auth from "@/common/middlewares/auth.middleware";
import validation from "@/common/middlewares/validation.middleware";
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
    this.router.get(
      "/get-comments",
      validation.ids,
      this.controller.getComments
    );

    // the routes below require authentication
    this.router.use(auth.user);

    this.router.get("/get-history", this.controller.getCommentHistory);
    this.router.post(
      "/add-comment",
      validation.ids,
      this.controller.addComment
    );
    this.router.patch("/:commentId/update", this.controller.updateComment);
    this.router.delete("/:commentId/delete", this.controller.deleteComment);
  }
}

export const commentsRouter = new CommentRouter().router;
