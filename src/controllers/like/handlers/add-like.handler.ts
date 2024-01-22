import { Comment } from "@/models/comment.model";
import { Like } from "@/models/like.model";
import { Tweet } from "@/models/tweet.model";
import { Video } from "@/models/video.model";
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

  // check if the ids are real
  if (videoId) {
    const video = await Video.findById(videoId);
    if (video) throw new ApiError(400, "Wrong Video ID!");
  } else if (tweetId) {
    const tweet = await Tweet.findById(tweetId);
    if (tweet) throw new ApiError(400, "Wrong Tweet ID!");
  } else if (commentId) {
    const comment = await Comment.findById(commentId);
    if (comment) throw new ApiError(400, "Wrong Comment ID!");
  }

  // create like
  const like = await Like.create({
    value,
    owner: req.user?._id,
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
