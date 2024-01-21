import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { _createTweet } from "./handlers/create-tweet.handler";
import { _deleteTweet } from "./handlers/delete-tweet.handler";
import { _getUserTweets } from "./handlers/get-user-tweets.handler";
import { _updateTweet } from "./handlers/update-tweet.handler";

export const createTweet = asyncHandler(_createTweet);
export const deleteTweet = asyncHandler(_deleteTweet);
export const getUserTweets = asyncHandler(_getUserTweets);
export const updateTweet = asyncHandler(_updateTweet);
