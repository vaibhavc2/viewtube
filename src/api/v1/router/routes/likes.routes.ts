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
    /**
     * @openapi
     * /likes/count:
     *   get:
     *     tags:
     *       - Likes
     *     summary: Get likes count
     *     description: Get likes count
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
     *         name: value
     *         required: false
     *         type: number
     *         description: 0 - like, 1 - dislike
     */
    this.router.get("/count", validation.ids, this.controller.getLikesCount);

    // the routes below require authentication
    this.router.use(auth.user);

    /**
     * @openapi
     * /likes/history:
     *   get:
     *     tags:
     *       - Likes
     *     summary: Get like history
     *     description: Get like history of a user
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
     *         name: userId
     *         required: true
     *         type: string
     *       - in: query
     *         name: page
     *         required: false
     *         type: number
     *         description: The page number
     *       - in: query
     *         name: limit
     *         required: false
     *         type: number
     *         description: The number of likes to return
     *       - in: query
     *         name: sortBy
     *         required: false
     *         type: string
     *       - in: query
     *         name: sortType
     *         required: false
     *         type: string
     *       - in: query
     *         name: comments
     *         required: false
     *         type: number
     *         description: 0 - without comments, 1 - with comments
     *       - in: query
     *         name: videos
     *         required: false
     *         type: number
     *         description: 0 - without videos, 1 - with videos
     *       - in: query
     *         name: tweets
     *         required: false
     *         type: number
     *         description: 0 - without tweets, 1 - with tweets
     */
    this.router.get("/history", this.controller.getLikeHistory);

    /**
     * @openapi
     * /likes/add:
     *   post:
     *     tags:
     *       - Likes
     *     summary: Add a like
     *     description: Add a like on a video, tweet or comment
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
     *         name: value
     *         required: false
     *         type: number
     *         description: 0 - like, 1 - dislike
     */
    this.router.post("/add", validation.ids, this.controller.addLike);

    /**
     * @openapi
     * /likes/remove:
     *   delete:
     *     tags:
     *       - Likes
     *     summary: Remove a like
     *     description: Remove a like on a video, tweet or comment
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
     *         name: value
     *         required: false
     *         type: number
     *         description: 0 - like, 1 - dislike
     */
    this.router.delete("/remove", validation.ids, this.controller.removeLike);
  }
}

export const likesRouter = new LikeRouter().router;
