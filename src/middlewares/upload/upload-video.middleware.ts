import { __video_valid_mime_types } from "@/constants/middlewares/mime-types";
import { cloudinaryService } from "@/services/cloudinary.service";
import ApiError from "@/utils/api/error/api-error.util";
import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { NextFunction, Request, Response } from "express";
import getVideoDurationInSeconds from "get-video-duration";

export const uploadVideoMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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

    // get the duration of the video: videoLength
    const videoLength = await getVideoDurationInSeconds(videoLocalPath);

    // check if video length is available
    if (!videoLength) {
      throw new ApiError(400, "Could not extract the length of the video!");
    }

    // upload video to cloudinary
    const video =
      await cloudinaryService.uploadFileToCloudinary(videoLocalPath);

    // check if video upload failed
    if (!video?.secure_url) {
      throw new ApiError(400, "Video upload failed!");
    }

    // save video url to request body
    req.body.videoUrl = video.secure_url;

    // save video duration to request body
    req.body.duration = videoLength;

    // next middleware
    next();
  }
);
