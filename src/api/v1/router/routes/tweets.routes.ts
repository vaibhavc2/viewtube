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
    this.router.get("/get-tweets", this.controller.getUserTweets);

    // the routes below require authentication
    this.router.use(auth.user);

    this.router.post("/create", this.controller.createTweet);
    this.router.delete("/:tweetId/delete", this.controller.deleteTweet);
    this.router.patch("/:tweetId/update", this.controller.updateTweet);
  }
}

export const tweetsRouter = new TweetRouter().router;
