import { db } from "@/database/models";
import ApiError from "@/utils/api-error.util";
import { CreatedResponse } from "@/utils/api-response.util";
import { Request, Response } from "express";

export const createTweet = async (req: Request, res: Response) => {
  // get tweet data from req.body
  const { tweet } = req.body;

  // check if tweet is empty
  if (!tweet) {
    throw new ApiError(400, "Tweet cannot be empty!");
  }

  // get user from req.user
  const userId = req.user?._id;

  // create tweet in database
  const newTweet = await db.Tweet.create({
    content: tweet,
    owner: userId,
  });

  // check if created
  const createdTweet = await db.Tweet.findById(newTweet._id);

  // final verification
  if (!newTweet || !createdTweet) {
    throw new ApiError(500, "Something went wrong!");
  }

  // send response
  return res.status(201).json(
    new CreatedResponse("Tweet created successfully!", {
      tweet: createdTweet,
    })
  );
};
