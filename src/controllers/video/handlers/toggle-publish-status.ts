import { Video } from "@/models/video.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _togglePublishStatus = async (req: Request, res: Response) => {
  // get videoId from req.params
  const videoId = req.params.videoId;

  // get video from database
  const video = await Video.findOne({ _id: videoId });

  // check if video exists
  if (!video) {
    throw new ApiError(404, "Video not found!");
  }

  // toggle publish status
  video.isPublished = !video.isPublished;

  // save video
  await video.save();

  // send response
  return res.status(200).json(
    new SuccessResponse("Video publish status toggled successfully!", {
      video,
    })
  );
};
