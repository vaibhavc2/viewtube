import { Request, Response } from "express";
import { __video_valid_mime_types } from "../../../constants/middlewares/mime-types.js";
import { Video } from "../../../models/video.model.js";
import { cloudinaryService } from "../../../services/cloudinary.service.js";
import ApiError from "../../../utils/api/error/api-error.util.js";
import { SuccessResponse } from "../../../utils/api/res/api-response.util.js";

export const _uploadVideo = async (req: Request, res: Response) => {
  // get video local path
  const videoLocalPath = req.file?.path;

  // check if video file is missing
  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is missing!");
  }

  // check if video is a valid video file
  if (!__video_valid_mime_types.includes(req.file?.mimetype as string)) {
    throw new ApiError(400, "Invalid Video File!");
  }

  // upload video to cloudinary
  const video = await cloudinaryService.uploadFileToCloudinary(videoLocalPath);

  // check if video upload failed
  if (!video?.secure_url) {
    throw new ApiError(400, "Video upload failed!");
  }

  // save video url to database
  const savedVideo = await Video.findOneAndUpdate(
    { owner: req.user?._id },
    {
      $set: {
        videoUrl: video.secure_url,
      },
    },
    { new: true }
  ).select("videoUrl");

  // send response
  return res.status(200).json(
    new SuccessResponse("Video uploaded successfully!", {
      video: savedVideo,
    })
  );
};
