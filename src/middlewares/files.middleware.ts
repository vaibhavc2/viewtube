import { appConstants } from "@/constants";
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

  public uploadImage = ({ thumbnail = false }) =>
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      // get image local path
      const imageLocalPath = req.file?.path;

      // check if image file is missing
      if (!imageLocalPath) {
        throw new ApiError(
          400,
          `${thumbnail ? "Thumbnail" : "Image"} file upload failed!`
        );
      }

      // check if image is a valid image file
      if (
        !appConstants.imageValidMimeTypes.includes(req.file?.mimetype as string)
      ) {
        throw new ApiError(
          400,
          `Invalid ${thumbnail ? "Thumbnail" : "Image"} file!`
        );
      }

      // upload image to cloudinary
      const image =
        await cloudinaryService.uploadFileToCloudinary(imageLocalPath);

      // check if image upload failed
      if (!image?.secure_url) {
        throw new ApiError(
          400,
          `${thumbnail ? "Thumbnail" : "Image"} file upload failed!`
        );
      }

      // save image url to request body
      req.body.imageUrl = image.secure_url;

      // next middleware
      next();
    });

  public uploadVideo = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // get video local path
      const videoLocalPath = req.file?.path;

      // check if video file is missing
      if (!videoLocalPath) {
        throw new ApiError(400, "Video file is missing!");
      }

      // check if video is a valid video file
      if (
        !appConstants.videoValidMimeTypes.includes(req.file?.mimetype as string)
      ) {
        throw new ApiError(400, "Invalid Video File!");
      }

      // check if video is less than the allowed size
      const { size: videoSize } = fs.statSync(videoLocalPath);
      if (videoSize > appConstants.maxVideoSize) {
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
      if (videoLength < appConstants.minVideoLength) {
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

  public uploadImageAndVideo = ({ thumbnail = false }) =>
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
      if (!videoLocalPath) throw new ApiError(400, "Video is required!");
      if (!imageLocalPath)
        throw new ApiError(
          400,
          `${thumbnail ? "Thumbnail" : "Image File"} is required!`
        );

      // check if video and image are valid files
      if (
        !appConstants.videoValidMimeTypes.includes(files?.video[0]?.mimetype)
      ) {
        throw new ApiError(400, "Invalid Video file!");
      }
      if (
        !appConstants.imageValidMimeTypes.includes(files?.image[0]?.mimetype)
      ) {
        throw new ApiError(
          400,
          `Invalid ${thumbnail ? "Thumbnail" : "Image"} file!`
        );
      }

      // check if video is less than the allowed size
      const { size: videoSize } = fs.statSync(videoLocalPath);
      if (videoSize > appConstants.maxVideoSize) {
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
      if (videoLength < appConstants.minVideoLength) {
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
        throw new ApiError(
          400,
          `${thumbnail ? "Thumbnail" : "Image"} upload failed!`
        );
      }

      // save video url to request body
      req.body.videoUrl = video.secure_url;

      // save image url to request body
      req.body.imageUrl = image.secure_url;

      // save video duration to request body
      req.body.duration = videoLength;

      // next middleware
      next();
    });

  public uploadAvatarAndCover = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // check for images: avatar, cover : avatar is compulsory
      const files = req?.files as GlobalTypes.MulterFiles;
      let avatarLocalPath: string | undefined = undefined;
      let coverLocalPath: string | undefined = undefined;

      if (files) {
        if (Array.isArray(files.avatar) && files.avatar.length > 0) {
          avatarLocalPath = files.avatar[0].path;
        }
        if (Array.isArray(files.cover) && files.cover.length > 0) {
          coverLocalPath = files.cover[0].path;
        }
      }

      if (!avatarLocalPath)
        throw new ApiError(400, "Avatar Image is required!");

      // check if avatar and cover are valid images: avatar is compulsory
      if (
        !appConstants.imageValidMimeTypes.includes(files?.avatar[0]?.mimetype)
      ) {
        throw new ApiError(400, "Invalid Avatar Image!");
      }
      if (coverLocalPath) {
        if (
          !appConstants.imageValidMimeTypes.includes(files?.cover[0]?.mimetype)
        ) {
          throw new ApiError(400, "Invalid Cover Image!");
        }
      }

      // upload avatar to cloudinary
      const avatar =
        await cloudinaryService.uploadFileToCloudinary(avatarLocalPath);

      // check if avatar upload failed
      if (!avatar?.secure_url) {
        throw new ApiError(
          500,
          "Something went wrong while uploading Avatar Image to server!"
        );
      }

      // save avatar url to request body
      req.body.avatarUrl = avatar.secure_url;

      // upload cover to cloudinary
      let cover = null;
      if (coverLocalPath) {
        cover = await cloudinaryService.uploadFileToCloudinary(coverLocalPath);
      }

      // check if cover upload failed
      if (coverLocalPath) {
        if (!cover?.secure_url) {
          await cloudinaryService.deleteFileFromCloudinary(avatar.secure_url);
          throw new ApiError(
            500,
            "Something went wrong while uploading Cover Image to server!"
          );
        }
      }

      // save cover url to request body
      req.body.coverUrl = cover?.secure_url || "";

      // next middleware
      next();
    }
  );
}
