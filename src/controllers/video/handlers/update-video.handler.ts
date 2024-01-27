import { Video } from "@/models/video.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _updateVideo = async (req: Request, res: Response) => {
  // get videoUrl and duration from req.body
  const { videoUrl, duration } = req.body as {
    videoUrl: string;
    duration: number;
  };

  // check if video upload failed
  if (!videoUrl || !duration) {
    throw new ApiError(400, "Video upload failed!");
  }

  // get videoId from req.params
  const videoId = req.params.videoId;

  // save video url to database
  const savedVideo = await Video.findOneAndUpdate(
    {
      _id: videoId,
      owner: req.user?._id,
    },
    {
      $set: {
        videoUrl,
        duration,
      },
    },
    { new: true }
  );

  // send response
  return res.status(200).json(
    new SuccessResponse("Video uploaded successfully!", {
      video: savedVideo,
    })
  );
};
