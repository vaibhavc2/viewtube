import { Request, Response } from "express";
import mongoose from "mongoose";
import ApiError from "../../../utils/api/error/api-error.util.js";
import { SuccessResponse } from "../../../utils/api/res/api-response.util.js";

export const _updateWatchHistory = async (req: Request, res: Response) => {
  // get the video id from the request params
  const { videoId } = req.params;

  // check if the video id is missing
  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  // check if the video is already present in the watch history
  const videoIndex = req.user.watchHistory.findIndex(
    (video: mongoose.Types.ObjectId) => video.toString() === videoId
  );

  // if the video is already present in the watch history, then remove it
  if (videoIndex !== -1) {
    req.user.watchHistory.splice(videoIndex, 1);
  }

  // add the video to the beginning of the watch history
  req.user.watchHistory.unshift(new mongoose.Types.ObjectId(videoId));

  // save the user object
  const result = await req.user.save({ validateBeforeSave: false });

  // check if the user object was saved successfully
  if (!result) {
    throw new ApiError(500, "Unable to update watch history");
  }

  // send the response
  return res
    .status(200)
    .json(new SuccessResponse("Watch history updated successfully"));
};
