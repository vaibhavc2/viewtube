import { appConstants } from "@/constants";
import { db } from "@/database/models";
import ApiError from "@/utils/api-error.util";
import { SuccessResponse } from "@/utils/api-response.util";
import { Request, Response } from "express";

export const updateVideoCategories = async (req: Request, res: Response) => {
  // get video categories from request body
  const { videoCategories } = req.body as { videoCategories: string[] };

  // get videoId from request params
  const { videoId } = req.params;

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

  // save video categories to database
  const video = await db.Video.findOneAndUpdate(
    {
      _id: videoId,
      owner: req.user?._id,
    },
    {
      $set: { videoCategories },
    },
    { new: true }
  );

  // send response
  return res.status(200).json(
    new SuccessResponse("Video categories updated successfully!", {
      video,
    })
  );
};
