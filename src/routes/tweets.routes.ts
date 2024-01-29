import { TweetController } from "@/controllers/tweet/tweet.controller";
import { verifyAuthentication } from "@/middlewares/auth/auth.middleware";
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
    this.router.use(verifyAuthentication);

    this.router.post("/create", this.controller.createTweet);
    this.router.delete("/:tweetId/delete", this.controller.deleteTweet);
    this.router.patch("/:tweetId/update", this.controller.updateTweet);
  }
}

export default new TweetRouter().router;
