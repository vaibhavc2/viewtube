import { Video } from "@/models/video.model";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const getVideo = async (req: Request, res: Response) => {
  // get videoId from request params
  const { videoId } = req.params;

  // get video from database
  const video = await Video.findById(videoId);

  // send response
  return res.status(200).json(
    new SuccessResponse("Video fetched successfully!", {
      video,
    })
  );
};
