import { db } from "@/database/models";
import { cloudinaryService } from "@/services/cloudinary.service";
import ApiError from "@/utils/api-error.util";
import { SuccessResponse } from "@/utils/api-response.util";
import { Request, Response } from "express";

export const deleteVideo = async (req: Request, res: Response) => {
  // get videoId from request params
  const { videoId } = req.params;

  // get video from database
  const video = await db.Video.findOne({
    _id: videoId,
    owner: req.user?._id,
  });

  // check if video exists
  if (!video) {
    throw new ApiError(404, "Video not found!");
  }

  // delete video from cloudinary
  await cloudinaryService.deleteFileFromCloudinary(video.videoUrl);

  // delete thumbnail from cloudinary
  await cloudinaryService.deleteFileFromCloudinary(video.thumbnail);

  // delete video from database
  await db.Video.findOneAndDelete({
    _id: videoId,
    owner: req.user?._id,
  });

  // send response
  return res
    .status(200)
    .json(new SuccessResponse("Video deleted successfully!"));
};
