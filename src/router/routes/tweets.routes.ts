import { TweetController } from "@/controllers/tweet/tweet.controller";
import { middlewares } from "@/middlewares";

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
    this.router.get("/get-tweets", this.controller.getUserTweets);

    // the routes below require authentication
    this.router.use(middlewares.auth.user);

    this.router.post("/create", this.controller.createTweet);
    this.router.delete("/:tweetId/delete", this.controller.deleteTweet);
    this.router.patch("/:tweetId/update", this.controller.updateTweet);
  }
}

export const tweetsRouter = new TweetRouter().router;
