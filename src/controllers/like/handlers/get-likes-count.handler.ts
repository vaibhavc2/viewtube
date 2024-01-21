import { Like } from "@/models/like.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _getLikesCount = async (req: Request, res: Response) => {
  // get tweetId, videoId, commentId from req.query
  const { tweetId, videoId, commentId } = req.query;

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

  // get likes count
  const likesCount = await Like.countDocuments({
    ...(tweetId && { tweet: tweetId }),
    ...(videoId && { video: videoId }),
    ...(commentId && { comment: commentId }),
  });

  // send response
  res.status(200).json(
    new SuccessResponse("Likes count retrieved successfully", {
      likesCount,
    })
  );
};
