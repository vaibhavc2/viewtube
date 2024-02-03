import { appConstants } from "@/constants";
import ApiError, { UnauthorizedError } from "@/utils/api-error.util";
import { SuccessResponse } from "@/utils/api-response.util";
import { Request, Response } from "express";

export const updateWatchHistory = async (req: Request, res: Response) => {
  // get the video id from the request params
  const { videoId } = req.params;

  // check if the video id is missing
  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  if (!req.user) throw new UnauthorizedError();

  const user = req.user;

  // check if the video is already present in the watch history
  const videoIndex = user.watchHistory.findIndex(
    (video) => String(video.videoId) === String(videoId)
  );

  // if the video is already present in the watch history, then remove it
  if (videoIndex !== -1) {
    user.watchHistory.splice(videoIndex, 1);
  }

  // add the video to the beginning of the watch history
  user.watchHistory.unshift({ videoId, watchedAt: new Date() });

  // limit the watch history to a const no of videos
  if (user.watchHistory.length > appConstants.limitWatchHistory)
    user.watchHistory = user.watchHistory.slice(
      0,
      appConstants.limitWatchHistory
    );

  //? => no need to sort the watch history as we are adding the video to the beginning of the array
  // sort the watch history by the date of watchedAt field
  // user.watchHistory.sort(
  //   (a, b) => b.watchedAt.getTime() - a.watchedAt.getTime()
  // );

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
