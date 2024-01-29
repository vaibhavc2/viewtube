import { Video } from "@/models/video.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const togglePublishStatus = async (req: Request, res: Response) => {
  // get videoId from req.params
  const videoId = req.params.videoId;

  // get video from database
  const video = await Video.findOne({
    _id: videoId,
    owner: req.user?._id,
  });

  // toggle publish status
  video.isPublished = !video.isPublished;

  // save video
  const result = await video.save({ validateBeforeSave: false });

  // check if video was saved successfully
  if (!result) {
    throw new ApiError(500, "Unable to toggle video publish status!");
  }

  // send response
  return res.status(200).json(
    new SuccessResponse("Video publish status toggled successfully!", {
      video,
    })
  );
};
