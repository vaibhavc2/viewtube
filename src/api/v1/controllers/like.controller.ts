import { asyncHandler } from "@/common/utils/async-handler.util";
import { db } from "@/common/db.client";
import ApiError from "@/common/utils/api-error.util";
import {
  CreatedResponse,
  SuccessResponse,
} from "@/common/utils/api-response.util";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { appConstants } from "@/common/constants";

export class LikeController {
  public addLike = asyncHandler(async (req: Request, res: Response) => {
    // get tweetId, videoId, commentId from req.query
    const { tweetId, videoId, commentId, value = 1 } = req.query;

    // validate value
    if (![1, -1].includes(Number(value))) {
      throw new ApiError(400, "Invalid value for like!");
    }

    // other validation is done using middleware!

    // check if like already exists
    const likeExists = await db.Like.findOne({
      owner: req.user?._id,
      ...(tweetId && { tweet: tweetId }),
      ...(videoId && { video: videoId }),
      ...(commentId && { comment: commentId }),
    });

    // if like exists and the value of like matches, throw error
    if (likeExists && likeExists.value === Number(value)) {
      throw new ApiError(
        400,
        `You have already ${Number(value) === -1 ? "dis" : ""}liked this!`
      );
    } else if (likeExists && likeExists.value !== Number(value)) {
      // if like exists and value doesn't match, update it
      likeExists.value = Number(value);

      const result = await likeExists.save({ validateBeforeSave: false });

      // check if like was saved successfully
      if (!result) {
        throw new ApiError(500, "Unable to update like!");
      }

      return res.status(200).json(
        new SuccessResponse("Like updated successfully", {
          like: likeExists,
        })
      );
    }

    // create like
    const like = await db.Like.create({
      value,
      owner: req.user?._id,
      ...(tweetId && { tweet: tweetId }),
      ...(videoId && { video: videoId }),
      ...(commentId && { comment: commentId }),
    });

    // check if created
    const createdLike = await db.Like.findById(like._id);

    // final verification
    if (!like || !createdLike) {
      throw new ApiError(500, "Something went wrong while adding like!");
    }

    // send response
    res.status(201).json(
      new CreatedResponse("Like created successfully", {
        like: createdLike,
      })
    );
  });

  public removeLike = asyncHandler(async (req: Request, res: Response) => {
    // get commentId, videoId, tweetId from req.query
    const { commentId, videoId, tweetId } = req.query;

    // validate ids using middleware!
    // find the like
    const like = await db.Like.findOne({
      owner: req.user?._id,
      ...(commentId && { comment: commentId }),
      ...(videoId && { video: videoId }),
      ...(tweetId && { tweet: tweetId }),
    });

    // check if like exists
    if (!like) {
      throw new ApiError(404, "Like not found and could not be deleted");
    }

    // delete like
    await db.Like.findByIdAndDelete(like._id);

    // send response
    res.status(200).json(new SuccessResponse("Like deleted successfully"));
  });

  public getLikesCount = asyncHandler(async (req: Request, res: Response) => {
    // get tweetId, videoId, commentId from req.query
    const { tweetId, videoId, commentId, value = 1 } = req.query;

    // validate value
    if (![1, -1].includes(Number(value))) {
      throw new ApiError(400, "Invalid value for like!");
    }

    // validate ids using middleware!
    // get likes count
    const likesCount = await db.Like.countDocuments({
      value, // 1 for like, -1 for dislike
      ...(tweetId && { tweet: tweetId }),
      ...(videoId && { video: videoId }),
      ...(commentId && { comment: commentId }),
    });

    // send response
    res.status(200).json(
      new SuccessResponse(
        `${Number(value) === 1 ? "Likes" : "Dislikes"} count retrieved successfully`,
        {
          likes: {
            count: likesCount,
          },
        }
      )
    );
  });

  public getLikeHistory = asyncHandler(async (req: Request, res: Response) => {
    const { pagination } = appConstants;
    // get userId, page, limit, sortBy, sortType, query, commentId, videoId, tweetId, from req.query
    const {
      page = pagination.page,
      limit = pagination.pageLimit,
      sortBy = pagination.sortBy,
      sortType = pagination.sortType,
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
      owner: new mongoose.Types.ObjectId(req.user?._id as string),
      ...(comments && { comment: { $exists: true } }),
      ...(videos && { video: { $exists: true } }),
      ...(tweets && { tweet: { $exists: true } }),
    };

    // get likes history
    const likes = await db.Like.aggregatePaginate(
      db.Like.aggregate([{ $match: match }]),
      options
    );

    // send response
    res.status(200).json(
      new SuccessResponse("Like history retrieved successfully", {
        likes,
      })
    );
  });
}
