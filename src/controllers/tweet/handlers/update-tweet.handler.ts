import { db } from "@/database/models";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const updateTweet = async (req: Request, res: Response) => {
  // get tweetId from req.params
  const tweetId = req.params.tweetId;

  // get userId from req.user
  const userId = req.user?._id;

  // get tweet from database
  const tweet = await db.Tweet.findOne({
    _id: tweetId,
    owner: userId,
  });

  // if tweet not found, send error response
  if (!tweet) {
    throw new ApiError(404, "Tweet not found!");
  }

  // get tweet data from req.body
  const { tweet: tweetContent } = req.body;

  // check if tweet is empty
  if (!tweetContent) {
    throw new ApiError(400, "Tweet cannot be empty!");
  }

  // update tweet in database
  tweet.content = tweetContent;

  // save tweet
  const result = await tweet.save({ validateBeforeSave: false });

  // check if tweet was saved successfully
  if (!result) {
    throw new ApiError(500, "Unable to update tweet!");
  }

  // send response
  return res.status(200).json(
    new SuccessResponse("Tweet updated successfully!", {
      tweet,
    })
  );
};
