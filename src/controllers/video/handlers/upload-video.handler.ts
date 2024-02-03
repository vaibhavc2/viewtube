import { appConstants } from "@/constants";
import { db } from "@/database/models";
import { cloudinaryService } from "@/services/cloudinary.service";
import ApiError from "@/utils/api/error/api-error.util";
import { CreatedResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const uploadVideo = async (req: Request, res: Response) => {
  // get video details from request body
  const {
    title,
    description,
    videoUrl,
    duration,
    imageUrl: thumbnail,
    videoCategories,
  } = req.body as {
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
    imageUrl: string;
    videoCategories: string[];
  };

  // validate videoUrl and thumbnail
  if (!videoUrl || !thumbnail) {
    throw new ApiError(400, "Video and thumbnail are required!");
  }

  // validate video categories
  if (!videoCategories || videoCategories.length === 0) {
    throw new ApiError(400, "Video categories are required!");
  }
  if (videoCategories.length > 5) {
    // max 5 categories
    throw new ApiError(400, "Maximum of 5 categories are allowed!");
  }
  if (
    // some: returns true if at least one element in the array satisfies the provided testing function
    appConstants.videoCategories.some(
      (category) => !videoCategories.includes(category)
    )
  ) {
    throw new ApiError(400, "Invalid video category!");
  }

  // create video
  const video = await db.Video.create({
    owner: req.user?._id,
    title,
    description,
    videoUrl,
    duration,
    thumbnail,
    videoCategories,
  });

  // verify if created
  const createdVideo = await db.Video.findById(video._id);

  // final verification
  if (!video || !createdVideo) {
    await cloudinaryService.deleteFileFromCloudinary(videoUrl);
    await cloudinaryService.deleteFileFromCloudinary(thumbnail);
    throw new ApiError(500, "Something went wrong!");
  }

  // send response
  return res.status(201).json(
    new CreatedResponse("Video uploaded successfully!", {
      video: createdVideo,
    })
  );
};
