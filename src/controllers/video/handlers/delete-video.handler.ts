import { Request, Response } from "express";
import mongoose from "mongoose";
import { Video } from "../../../models/video.model.js";
import ApiError from "../../../utils/api/error/api-error.util.js";
import { SuccessResponse } from "../../../utils/api/res/api-response.util.js";

export const _deleteVideo = async (req: Request, res: Response) => {
  // get videoId from request params
  const { videoId } = req.params;

  // delete video from database
  const result = await Video.findOneAndDelete(
    { _id: new mongoose.Types.ObjectId(videoId), owner: req.user?._id },
  )

  // check if video was deleted
  if (!result) {
    throw new ApiError(400, "Video not found!");
  }

  // send response
  return res.status(200).json(
    new SuccessResponse("Video deleted successfully!")
  )
};
