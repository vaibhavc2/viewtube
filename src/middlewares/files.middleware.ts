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
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export class FilesMiddleware {
  constructor() {}

  public uploadLocally = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "temp/uploads");
      },
      filename: function (req, file, cb) {
        cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
      },
    }),
  });

  public uploadImage = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // get image local path
      const imageLocalPath = req.file?.path;

      // check if image file is missing
      if (!imageLocalPath) {
        throw new ApiError(400, "Image file is missing!");
      }

      // check if image is a valid image file
      if (!__img_valid_mime_types.includes(req.file?.mimetype as string)) {
        throw new ApiError(400, "Invalid Image File!");
      }

      // upload image to cloudinary
      const image =
        await cloudinaryService.uploadFileToCloudinary(imageLocalPath);

      // check if image upload failed
      if (!image?.secure_url) {
        throw new ApiError(400, "Image upload failed!");
      }

      // save image url to request body
      req.body.imageUrl = image.secure_url;

      // next middleware
      next();
    }
  );

  public uploadVideo = asyncHandler(
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

      // get the duration of the video: videoLength
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

      // save video url to request body
      req.body.videoUrl = video.secure_url;

      // save video duration to request body
      req.body.duration = videoLength;

      // next middleware
      next();
    }
  );

  public uploadImageAndVideo = asyncHandler(
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
}
