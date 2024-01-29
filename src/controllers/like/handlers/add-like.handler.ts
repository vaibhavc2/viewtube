import { Like } from "@/models/like.model";
import ApiError from "@/utils/api/error/api-error.util";
import {
  CreatedResponse,
  SuccessResponse,
} from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const addLike = async (req: Request, res: Response) => {
  // get tweetId, videoId, commentId from req.query
  const { tweetId, videoId, commentId, value = 1 } = req.query;

  // validate value
  if (![1, -1].includes(Number(value))) {
    throw new ApiError(400, "Invalid value for like!");
  }

  // other validation is done using middleware!

  // check if like already exists
  const likeExists = await Like.findOne({
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
    likeExists.value = value;

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
