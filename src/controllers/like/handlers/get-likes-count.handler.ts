import { Like } from "@/models/like.model";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _getLikesCount = async (req: Request, res: Response) => {
  // get tweetId, videoId, commentId from req.query
  const { tweetId, videoId, commentId } = req.query;

  // validate ids using middleware!
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
