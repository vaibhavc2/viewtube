import { Like } from "@/models/like.model";
import ApiError from "@/utils/api/error/api-error.util";
import { CreatedResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _addLike = async (req: Request, res: Response) => {
  // get tweetId, videoId, commentId from req.query
  const { tweetId, videoId, commentId, value = 1 } = req.query;

  // validation is done using middleware!
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
