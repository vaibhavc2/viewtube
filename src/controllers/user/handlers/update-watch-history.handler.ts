import { User } from "@/models/user.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const updateWatchHistory = async (req: Request, res: Response) => {
  // get the video id from the request params
  const { videoId } = req.params;

  // check if the video id is missing
  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  // find the user
  const user = await User.findById(req.user?._id);

  // check if the video is already present in the watch history
  const videoIndex = user.watchHistory.findIndex(
    (video: mongoose.Types.ObjectId) => String(video) === videoId
  );

  // if the video is already present in the watch history, then remove it
  if (videoIndex !== -1) {
    user.watchHistory.splice(videoIndex, 1);
  }

  // add the video to the beginning of the watch history
  user.watchHistory.unshift(new mongoose.Types.ObjectId(videoId));

  // save the user object
  const result = await user.save({ validateBeforeSave: false });

  // check if the user object was saved successfully
  if (!result) {
    throw new ApiError(500, "Unable to update watch history");
  }

  // send the response
  return res.status(200).json(
    new SuccessResponse("Watch history updated successfully", {
      watchHistory: user.watchHistory,
    })
  );
};
