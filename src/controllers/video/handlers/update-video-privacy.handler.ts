import { Request, Response } from "express";
import mongoose from "mongoose";
import { Video } from "../../../models/video.model.js";
import ApiError from "../../../utils/api/error/api-error.util.js";
import { SuccessResponse } from "../../../utils/api/res/api-response.util.js";

export const _updateVideoPrivacy = async (req: Request, res: Response) => {
  // get video privacy from request body
  const { privacy } = req.body as { privacy: boolean };

  // get videoId from request params
  const { videoId } = req.params;

  // validate privacy
  if (privacy === undefined) {
    throw new ApiError(400, "Privacy is required!");
  }

  // save video privacy to database
  const video = await Video.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(videoId),
      owner: req.user?._id,
    },
    {
      $set: {
        privacy,
      },
    },
    { new: true }
  );

  // send response
  return res.status(200).json(
    new SuccessResponse("Video privacy updated successfully!", {
      video,
    })
  );
};
