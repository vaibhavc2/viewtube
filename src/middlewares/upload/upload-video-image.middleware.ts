import {
  __img_valid_mime_types,
  __video_valid_mime_types,
} from "@/constants/middlewares/mime-types";
import { __max_video_size, __min_video_length } from "@/constants/video";
import { cloudinaryService } from "@/services/cloudinary.service";
import ApiError from "@/utils/api/error/api-error.util";
import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { convertToMp4 } from "@/utils/video/convert-to-mp4.util";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import getVideoDurationInSeconds from "get-video-duration";

export const uploadVideoImageMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // get video and image local paths
    const files = req?.files as GlobalTypes.MulterFiles;
    let videoLocalPath: string | undefined = undefined;
    let imageLocalPath: string | undefined = undefined;

    if (files) {
      if (Array.isArray(files.video) && files.video.length > 0) {
        videoLocalPath = files.video[0].path;
      }
      if (Array.isArray(files.image) && files.image.length > 0) {
        imageLocalPath = files.image[0].path;
      }
    }

    // check if video and image files are missing
    if (!videoLocalPath) throw new ApiError(400, "Video File is required!");
    if (!imageLocalPath) throw new ApiError(400, "Image File is required!");

    // check if video and image are valid files
    if (!__video_valid_mime_types.includes(files?.video[0]?.mimetype)) {
      throw new ApiError(400, "Invalid Video file!");
    }
    if (!__img_valid_mime_types.includes(files?.image[0]?.mimetype)) {
      throw new ApiError(400, "Invalid Image file!");
    }

    // check if video is less than the allowed size
    const { size: videoSize } = fs.statSync(videoLocalPath);
    if (videoSize > __max_video_size) {
      throw new ApiError(400, "Video size is too large!");
    }

    // convert video to mp4
    const videoMp4LocalPath = await convertToMp4(videoLocalPath);

    // check if video conversion failed
    if (!videoMp4LocalPath) {
      throw new ApiError(400, "Video conversion failed!");
    }

    // calculate video duration
    const videoLength = await getVideoDurationInSeconds(videoMp4LocalPath);

    // check if video length is available
    if (!videoLength) {
      throw new ApiError(400, "Could not extract the length of the video!");
    }

    // check if video length is less than the allowed length
    if (videoLength < __min_video_length) {
      throw new ApiError(400, "Video length is too short!");
    }

    // upload video to cloudinary
    const video =
      await cloudinaryService.uploadFileToCloudinary(videoMp4LocalPath);

    // check if video upload failed
    if (!video?.secure_url) {
      throw new ApiError(400, "Video upload failed!");
    }

    // upload image to cloudinary
    const image =
      await cloudinaryService.uploadFileToCloudinary(imageLocalPath);

    // check if image upload failed
    if (!image?.secure_url) {
      await cloudinaryService.deleteFileFromCloudinary(video.secure_url);
      throw new ApiError(400, "Image upload failed!");
    }

    // save video url to request body
    req.body.videoUrl = video.secure_url;

    // save image url to request body
    req.body.imageUrl = image.secure_url;

    // save video duration to request body
    req.body.duration = videoLength;

    // next middleware
    next();
  }
);
