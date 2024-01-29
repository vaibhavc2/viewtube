import { Tweet } from "@/models/tweet.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const deleteTweet = async (req: Request, res: Response) => {
  // get tweetId from req.params
  const tweetId = req.params.tweetId;

  // get userId from req.user
  const { _id: userId } = req.user;

  // find tweet in database
  const tweet = await Tweet.findById(tweetId);

  // if tweet not found, send error response
  if (!tweet) {
    throw new ApiError(404, "Tweet not found!");
  }

  // if user is not the owner of the tweet, send error response
  if (String(tweet.owner) !== String(userId)) {
    throw new ApiError(403, "Unauthorized!");
  }

  // delete tweet from database
  await Tweet.findByIdAndDelete(tweetId);

  // send response
  return res
    .status(200)
    .json(new SuccessResponse("Tweet deleted successfully!"));
};
