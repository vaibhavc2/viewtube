import { asyncHandler } from "@/utils/async-handler.util";
import { createTweet } from "./handlers/create-tweet.handler";
import { deleteTweet } from "./handlers/delete-tweet.handler";
import { getUserTweets } from "./handlers/get-user-tweets.handler";
import { updateTweet } from "./handlers/update-tweet.handler";

export class TweetController {
  constructor() {}

  public createTweet = asyncHandler(createTweet);
  public updateTweet = asyncHandler(updateTweet);
  public deleteTweet = asyncHandler(deleteTweet);
  public getUserTweets = asyncHandler(getUserTweets);
}
