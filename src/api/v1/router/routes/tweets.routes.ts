import { TweetController } from "@/api/v1/controllers/tweet.controller";
import auth from "@/common/middlewares/auth.middleware";
import { Router } from "express";

class TweetRouter {
  public router: Router;
  public controller: TweetController;

  constructor() {
    this.router = Router();
    this.controller = new TweetController();
    this.routes();
  }

  public routes() {
    /**
     * @openapi
     * /tweets/get:
     *   get:
     *     tags:
     *       - Tweets
     *     summary: Get user tweets
     *     description: Get user tweets
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
     *         name: page
     *         required: false
     *         type: number
     *       - in: query
     *         name: limit
     *         required: false
     *         type: number
     *       - in: query
     *         name: search
     *         required: false
     *         type: string
     *       - in: query
     *         name: userId
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
     *       - in: query
     *         name: query
     *         required: false
     *         type: string
     */
    this.router.get("/get", this.controller.getUserTweets);

    // the routes below require authentication
    this.router.use(auth.user);

    /**
     * @openapi
     * /tweets/post:
     *   post:
     *     tags:
     *       - Tweets
     *     summary: Post a user tweet
     *     description: Post a user tweet
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
     *               tweet:
     *                 type: string
     *     security:
     *       - bearerAuth: []
     */
    this.router.post("/post", this.controller.createTweet);

    /**
     * @openapi
     * /tweets/{tweetId}:
     *   patch:
     *     tags:
     *       - Tweets
     *     summary: Update a user tweet
     *     description: Update a user tweet
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
     *         name: tweetId
     *         required: true
     *         type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               tweet:
     *                 type: string
     *     security:
     *       - bearerAuth: []
     */
    this.router.patch("/:tweetId", this.controller.updateTweet);

    /**
     * @openapi
     * /tweets/{tweetId}:
     *   delete:
     *     tags:
     *       - Tweets
     *     summary: Delete a user tweet
     *     description: Delete a user tweet
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
     *         name: tweetId
     *         required: true
     *         type: string
     *     security:
     *       - bearerAuth: []
     * */
    this.router.delete("/:tweetId", this.controller.deleteTweet);
  }
}

export const tweetsRouter = new TweetRouter().router;
