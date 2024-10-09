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
    /**
     * @openapi
     * /comments:
     *   get:
     *     tags:
     *       - Comments
     *     summary: Get comments
     *     description: Get comments
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     *     parameters:
     *       - in: query
     *         name: videoId
     *         required: false
     *         type: string
     *       - in: query
     *         name: tweetId
     *         required: false
     *         type: string
     *       - in: query
     *         name: commentId
     *         required: false
     *         type: string
     *       - in: query
     *         name: userId
     *         required: false
     *         type: string
     *       - in: query
     *         name: page
     *         required: false
     *         type: number
     *       - in: query
     *         name: limit
     *         required: false
     *         type: string
     *       - in: query
     *         name: query
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
     * */
    this.router.get("/", validation.ids, this.controller.getComments);

    /**
     * @openapi
     * /comments/count:
     *   get:
     *     tags:
     *       - Comments
     *     summary: Get comments count
     *     description: Get comments count
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     *     parameters:
     *       - in: query
     *         name: videoId
     *         required: false
     *         type: string
     *       - in: query
     *         name: tweetId
     *         required: false
     *         type: string
     *       - in: query
     *         name: commentId
     *         required: false
     *         type: string
     *
     * */
    this.router.get(
      "/count",
      validation.ids,
      this.controller.getTotalCommentsCount
    );

    // the routes below require authentication
    this.router.use(auth.user);

    /**
     * @openapi
     * /comments/history:
     *   get:
     *     tags:
     *       - Comments
     *     summary: Get comments history
     *     description: Get comments history
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     *     parameters:
     *       - in: query
     *         name: comments
     *         required: false
     *         type: number
     *       - in: query
     *         name: videos
     *         required: false
     *         type: number
     *       - in: query
     *         name: tweets
     *         required: false
     *         type: number
     *       - in: query
     *         name: page
     *         required: false
     *         type: number
     *       - in: query
     *         name: limit
     *         required: false
     *         type: string
     *       - in: query
     *         name: query
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
     * */
    this.router.get("/history", this.controller.getCommentHistory);

    /**
     * @openapi
     * /comments/add:
     *   post:
     *     tags:
     *       - Comments
     *     summary: Add comment
     *     description: Add comment
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               content:
     *                 type: string
     *                 required: true
     *                 description: Comment content
     *     parameters:
     *       - in: query
     *         name: videoId
     *         required: false
     *         type: string
     *       - in: query
     *         name: tweetId
     *         required: false
     *         type: string
     *       - in: query
     *         name: commentId
     *         required: false
     *         type: string
     * */
    this.router.post("/add", validation.ids, this.controller.addComment);

    /**
     * @openapi
     * /comments/{commentId}:
     *   patch:
     *     tags:
     *       - Comments
     *     summary: Update comment
     *     description: Update comment
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               content:
     *                 type: string
     *                 required: true
     *                 description: Comment content
     *     parameters:
     *       - in: path
     *         name: commentId
     *         required: true
     *         type: string
     * */
    this.router.patch("/:commentId", this.controller.updateComment);

    /**
     * @openapi
     * /comments/{commentId}:
     *   delete:
     *     tags:
     *       - Comments
     *     summary: Delete comment
     *     description: Delete comment
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     *     parameters:
     *       - in: path
     *         name: commentId
     *         required: true
     *         type: string
     * */
    this.router.delete("/:commentId", this.controller.deleteComment);
  }
}

export const commentsRouter = new CommentRouter().router;
