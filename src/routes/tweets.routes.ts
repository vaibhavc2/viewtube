import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "@/controllers/tweet/tweet.controller";
import { Router } from "express";

const router = Router();

router.route("/create").post(createTweet);

router.route("/:tweetId/delete").get(deleteTweet);

router.route("/get-tweets").get(getUserTweets);

router.route("/:tweetId/update").get(updateTweet);

export default router;
