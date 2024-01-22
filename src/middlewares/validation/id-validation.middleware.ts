import { Comment } from "@/models/comment.model";
import { Tweet } from "@/models/tweet.model";
import { Video } from "@/models/video.model";
import ApiError from "@/utils/api/error/api-error.util";
import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { NextFunction, Request, Response } from "express";

export const validateIds = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId, videoId, tweetId } = req.query;

    // check if one of tweetId, videoId, commentId is provided
    if (!tweetId && !videoId && !commentId) {
      throw new ApiError(400, "One of tweetId, videoId, commentId is required");
    }

    // there should be only one of tweetId, videoId, commentId
    if (
      (tweetId && videoId) ||
      (tweetId && commentId) ||
      (videoId && commentId)
    ) {
      throw new ApiError(
        400,
        "Only one of tweetId, videoId, commentId is allowed"
      );
    }

    // check if the ids are real
    if (videoId) {
      const video = await Video.findById(videoId);
      if (!video) throw new ApiError(400, "Wrong Video ID!");
    } else if (tweetId) {
      const tweet = await Tweet.findById(tweetId);
      if (!tweet) throw new ApiError(400, "Wrong Tweet ID!");
    } else if (commentId) {
      const comment = await Comment.findById(commentId);
      if (!comment) throw new ApiError(400, "Wrong Comment ID!");
    }

    next();
  }
);
