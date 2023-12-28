import { Request, Response } from "express";
import { Video } from "../../../models/video.model.js";
import ApiError from "../../../utils/api/error/api-error.util.js";
import { CreatedResponse } from "../../../utils/api/res/api-response.util.js";

export const _uploadVideoDetails = async (req: Request, res: Response) => {
  // get video details from request body
  const { title, description } = req.body as {
    title: string;
    description: string;
  };

  // validate details here also
  if (!title || !description) {
    throw new ApiError(400, "Title and Description are required!");
  }

  // save video details to database
  const video = await Video.create(
    {
      owner: req.user?._id,
      title,
      description,
      videoUrl: "/",
      thumbnail: "/",
    },
    { new: true }
  );

  // send response
  return res.status(201).json(
    new CreatedResponse("Video details uploaded successfully!", {
      video,
    })
  );
};
