import { Video } from "@/models/video.model";
import { cloudinaryService } from "@/services/cloudinary.service";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const deleteVideo = async (req: Request, res: Response) => {
  // get videoId from request params
  const { videoId } = req.params;

  // get video from database
  const video = await Video.findOne({
    _id: videoId,
    owner: req.user?._id,
  });

  // delete video from cloudinary
  await cloudinaryService.deleteFileFromCloudinary(video.videoUrl);

  // delete thumbnail from cloudinary
  await cloudinaryService.deleteFileFromCloudinary(video.thumbnail);

  // delete video from database
  await Video.findOneAndDelete({
    _id: videoId,
    owner: req.user?._id,
  });

  // send response
  return res
    .status(200)
    .json(new SuccessResponse("Video deleted successfully!"));
};
