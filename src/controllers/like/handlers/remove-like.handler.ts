import { Like } from "@/models/like.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _removeLike = async (req: Request, res: Response) => {
  // get commentId, videoId, tweetId from req.query
  const { commentId, videoId, tweetId } = req.query;

  // check if one of commentId, videoId, tweetId is provided
  if (!commentId && !videoId && !tweetId) {
    throw new ApiError(400, "One of commentId, videoId, tweetId is required");
  }

  // there should be only one of commentId, videoId, tweetId
  if (
    (commentId && videoId) ||
    (commentId && tweetId) ||
    (videoId && tweetId)
  ) {
    throw new ApiError(
      400,
      "Only one of commentId, videoId, tweetId is allowed"
    );
  }

  // get userId from req.user
  const userId = req.user._id;

  // find the like
  const like = await Like.findOne({
    owner: userId,
    ...(commentId && { comment: commentId }),
    ...(videoId && { video: videoId }),
    ...(tweetId && { tweet: tweetId }),
  });

  // check if like exists
  if (!like) {
    throw new ApiError(404, "Like not found and could not be deleted");
  }

  // delete like
  await like.delete();

  // send response
  res.status(200).json(new SuccessResponse("Like deleted successfully"));
};
