import { Video } from "@/models/video.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util.js";
import { Request, Response } from "express";

export const _increaseViews = async (req: Request, res: Response) => {
  // get videoId from req.params
  const videoId = req.params.videoId;

  // get video from database
  const video = await Video.findOne({ _id: videoId });

  // const video = await Video.findByIdAndUpdate(videoId,{
  //   $inc: {
  //     views:1
  //   }
  // })

  // check if video exists
  if (!video) {
    throw new ApiError(404, "Video not found!");
  }

  // increase views
  video.views += 1;

  // save video
  await video.save();

  // send response
  return res.status(200).json(
    new SuccessResponse("Video views increased successfully!", {
      video,
    })
  );
};
