import { Video } from "@/models/video.model";
import ApiError from "@/utils/api/error/api-error.util";
import { CreatedResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

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

  // create video
  const video = await Video.create({
    owner: req.user?._id,
    title,
    description,
    videoUrl: "/",
    thumbnail: "/",
  });

  // verify if created
  const createdVideo = await Video.findById(video._id);

  // final verification
  if (!video || !createdVideo) {
    throw new ApiError(500, "Something went wrong!");
  }

  // send response
  return res.status(201).json(
    new CreatedResponse("Video details uploaded successfully!", {
      video: createdVideo,
    })
  );
};
