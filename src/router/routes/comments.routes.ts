import { CommentController } from "@/controllers/comment/comment.controller";
import { middlewares } from "@/middlewares";
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
      middlewares.validation.ids,
      this.controller.getComments
    );

    // the routes below require authentication
    this.router.use(middlewares.auth.user);

    this.router.get("/get-history", this.controller.getCommentHistory);
    this.router.post(
      "/add-comment",
      middlewares.validation.ids,
      this.controller.addComment
    );
    this.router.patch("/:commentId/update", this.controller.updateComment);
    this.router.delete("/:commentId/delete", this.controller.deleteComment);
  }
}

export const commentsRouter = new CommentRouter().router;
