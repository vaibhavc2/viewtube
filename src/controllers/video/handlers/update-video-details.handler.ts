import { Request, Response } from "express";
import mongoose from "mongoose";
import { Video } from "../../../models/video.model.js";
import ApiError from "../../../utils/api/error/api-error.util.js";
import { SuccessResponse } from "../../../utils/api/res/api-response.util.js";

export const _updateVideoDetails = async (req: Request, res: Response) => {
  // get video details from request body
  const { title, description } = req.body as {
    title: string;
    description: string;
  };

  // get videoId from request params
  const { videoId } = req.params;

  // validate details here also
  if (!title || !description) {
    throw new ApiError(400, "Title and Description are required!");
  }

  // validate title
  if (title.length < 3) {
    throw new ApiError(400, "Title must be at least 3 characters.");
  }

  // validate description
  if (description.length < 3) {
    throw new ApiError(400, "Description must be at least 3 characters.");
  }

  // check if any of the details are valid
  let validDetails = [];
  if (title) validDetails.push(title);
  if (description) validDetails.push(description);

  // save video details to database
  const video = await Video.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(videoId),
      owner: req.user?._id,
    },
    {
      ...validDetails,
    },
    { new: true }
  );

  // send response
  return res.status(200).json(
    new SuccessResponse("Video details uploaded successfully!", {
      video,
    })
  );
};
