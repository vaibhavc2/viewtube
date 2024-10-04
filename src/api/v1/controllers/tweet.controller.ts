import { asyncHandler } from "@/common/utils/async-handler.util";
import { db } from "@/common/db.client";
import ApiError from "@/common/utils/api-error.util";
import {
  CreatedResponse,
  SuccessResponse,
} from "@/common/utils/api-response.util";
import { Request, Response } from "express";
import { appConstants } from "@/common/constants";
import mongoose from "mongoose";

export class TweetController {
  createTweet = asyncHandler(async (req: Request, res: Response) => {
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
  });

  updateTweet = asyncHandler(async (req: Request, res: Response) => {
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
  });

  deleteTweet = asyncHandler(async (req: Request, res: Response) => {
    // get tweetId from req.params
    const tweetId = req.params.tweetId;

    // get userId from req.user
    const userId = req.user?._id;

    // find tweet in database
    const tweet = await db.Tweet.findById(tweetId);

    // if tweet not found, send error response
    if (!tweet) {
      throw new ApiError(404, "Tweet not found!");
    }

    // if user is not the owner of the tweet, send error response
    if (String(tweet.owner) !== String(userId))
      throw new ApiError(
        403,
        "Unauthorized! You are not the owner of this tweet."
      );

    // delete tweet from database
    const result = await db.Tweet.findByIdAndDelete(tweetId);

    // if tweet not deleted, send error response
    if (!result) {
      throw new ApiError(500, "Failed to delete tweet.");
    }

    // send response
    return res
      .status(200)
      .json(new SuccessResponse("Tweet deleted successfully!"));
  });

  getUserTweets = asyncHandler(async (req: Request, res: Response) => {
    const { pagination } = appConstants;
    const {
      page: __page,
      pageLimit: __page_limit,
      sortBy: __sort_by,
      sortType: __sort_type,
    } = pagination;

    // get userId, page, limit, sortBy, sortType, query from req.query
    const {
      page = __page,
      limit = __page_limit,
      query,
      sortBy = __sort_by,
      sortType = __sort_type,
      userId,
    } = req.query;

    // Define the options for pagination and sorting
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort: {
        [sortBy as string]: sortType === "desc" ? -1 : 1,
      },
    };

    // Define the match object for the MongoDB query. This will be used to filter tweets.
    const match = {
      ...(query && { content: { $regex: String(query) || "", $options: "i" } }),
    };

    // If a userId is provided in the query parameters, add it to the match object.
    // This will filter tweets to only return those owned by the specified user.
    if (userId) {
      const user = await db.User.findById(userId);
      if (user)
        (match as any)["owner"] = new mongoose.Types.ObjectId(
          user._id as string
        );
      else throw new ApiError(404, "User not found! Wrong userId!");
    }

    // get tweets from database
    const tweets = await db.Tweet.aggregatePaginate(
      db.Tweet.aggregate([{ $match: match }]),
      options
    );

    // send response
    return res.status(200).json(
      new SuccessResponse("User tweets retrieved successfully!", {
        tweets,
      })
    );
  });
}
