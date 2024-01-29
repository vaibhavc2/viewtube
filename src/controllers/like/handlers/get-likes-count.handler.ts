import { Like } from "@/models/like.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _getLikesCount = async (req: Request, res: Response) => {
  // get tweetId, videoId, commentId from req.query
  const { tweetId, videoId, commentId, value = 1 } = req.query;

  // validate value
  if (![1, -1].includes(Number(value))) {
    throw new ApiError(400, "Invalid value for like!");
  }

  // validate ids using middleware!
  // get likes count
  const likesCount = await Like.countDocuments({
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
};
