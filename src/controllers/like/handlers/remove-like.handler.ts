import { Like } from "@/models/like.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const removeLike = async (req: Request, res: Response) => {
  // get commentId, videoId, tweetId from req.query
  const { commentId, videoId, tweetId } = req.query;

  // validate ids using middleware!
  // find the like
  const like = await Like.findOne({
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
  await Like.findByIdAndDelete(like._id);

  // send response
  res.status(200).json(new SuccessResponse("Like deleted successfully"));
};
