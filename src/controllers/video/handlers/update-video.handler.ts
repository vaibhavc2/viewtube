import { db } from "@/database/models";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const updateVideo = async (req: Request, res: Response) => {
  // get videoUrl and duration from req.body
  const { videoUrl, duration } = req.body as {
    videoUrl: string;
    duration: number;
  };

  // get videoId from req.params
  const videoId = req.params.videoId;

  // save video url to database
  const savedVideo = await db.Video.findOneAndUpdate(
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
