import {
  __page,
  __page_limit,
  __sort_by,
  __sort_type,
} from "@/constants/pagination";
import { Like } from "@/models/like.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const getLikeHistory = async (req: Request, res: Response) => {
  // get userId, page, limit, sortBy, sortType, query, commentId, videoId, tweetId, from req.query
  const {
    page = __page,
    limit = __page_limit,
    sortBy = __sort_by,
    sortType = __sort_type,
    comments, // boolean, send 1 for true, 0 for false
    videos, // boolean, send 1 for true, 0 for false
    tweets, // boolean, send 1 for true, 0 for false
  } = req.query;

  // validate comments, videos, tweets
  if ((comments && videos) || (comments && tweets) || (videos && tweets)) {
    throw new ApiError(400, "Send only one of comments, videos, tweets!");
  }
  if (comments && ![0, 1].includes(Number(comments))) {
    throw new ApiError(400, "Invalid value for comments!");
  }
  if (videos && ![0, 1].includes(Number(videos))) {
    throw new ApiError(400, "Invalid value for videos!");
  }
  if (tweets && ![0, 1].includes(Number(tweets))) {
    throw new ApiError(400, "Invalid value for tweets!");
  }

  // Define the options for pagination and sorting
  const options = {
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
    sort: {
      [sortBy as string]: sortType === "desc" ? -1 : 1,
    },
  };

  // Define the match object for the MongoDB query.
  const match = {
    owner: new mongoose.Types.ObjectId(req.user?._id),
    ...(comments && { comment: { $exists: true } }),
    ...(videos && { video: { $exists: true } }),
    ...(tweets && { tweet: { $exists: true } }),
  };

  // get likes history
  const likes = await Like.aggregatePaginate(
    Like.aggregate([{ $match: match }]),
    options
  );

  // send response
  res.status(200).json(
    new SuccessResponse("Like history retrieved successfully", {
      likes,
    })
  );
};
