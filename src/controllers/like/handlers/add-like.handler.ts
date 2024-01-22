import { Like } from "@/models/like.model";
import ApiError from "@/utils/api/error/api-error.util";
import { CreatedResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _addLike = async (req: Request, res: Response) => {
  // get tweetId, videoId, commentId from req.query
  const { tweetId, videoId, commentId, value = 1 } = req.query;

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

  // get userId from req.user
  const userId = req.user._id;

  // create like
  const like = await Like.create({
    value,
    owner: userId,
    ...(tweetId && { tweet: tweetId }),
    ...(videoId && { video: videoId }),
    ...(commentId && { comment: commentId }),
  });

  // check if created
  const createdLike = await Like.findById(like._id);

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
};
