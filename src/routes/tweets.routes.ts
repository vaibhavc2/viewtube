import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "@/controllers/tweet/tweet.controller";
import { verifyAuthentication } from "@/middlewares/auth/auth.middleware";
import { Router } from "express";

const router = Router();

router.route("/get-tweets").get(getUserTweets);

// the routes below require authentication
router.use(verifyAuthentication);

router.route("/create").post(createTweet);

router.route("/:tweetId/delete").delete(deleteTweet);

router.route("/:tweetId/update").patch(updateTweet);

export default router;
