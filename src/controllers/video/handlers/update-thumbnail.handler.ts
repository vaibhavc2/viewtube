import { Video } from "@/models/video.model.js";
import ApiError from "@/utils/api/error/api-error.util.js";
import { SuccessResponse } from "@/utils/api/res/api-response.util.js";
import { Request, Response } from "express";

export const updateThumbnail = async (req: Request, res: Response) => {
  // get thumbnail from request body
  const { thumbnail } = req.body as { thumbnail: string };

  // check if thumbnail upload failed
  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail upload failed!");
  }

  // get videoId from request params
  const videoId = req.params.videoId;

  // save thumbnail url to database
  const video = await Video.findOneAndUpdate(
    {
      _id: videoId,
      owner: req.user?._id,
    },
    {
      $set: {
        thumbnail,
      },
    },
    { new: true }
  );

  // send response
  return res.status(200).json(
    new SuccessResponse("Thumbnail uploaded successfully!", {
      video,
    })
  );
};
