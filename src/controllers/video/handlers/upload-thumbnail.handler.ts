import { __img_valid_mime_types } from "@/constants/middlewares/mime-types";
import { Video } from "@/models/video.model";
import { cloudinaryService } from "@/services/cloudinary.service";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _uploadThumbnail = async (req: Request, res: Response) => {
  // get thumbnail local path
  const thumbnailLocalPath = req.file?.path;

  // check if thumbnail file is missing
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is missing!");
  }

  // check if thumbnail is a valid image
  if (!__img_valid_mime_types.includes(req.file?.mimetype as string)) {
    throw new ApiError(400, "Invalid Thumbnail Image!");
  }

  // upload thumbnail to cloudinary
  const thumbnail =
    await cloudinaryService.uploadFileToCloudinary(thumbnailLocalPath);

  // check if thumbnail upload failed
  if (!thumbnail?.secure_url) {
    throw new ApiError(400, "Thumbnail upload failed!");
  }

  // save thumbnail url to database
  const video = await Video.findOneAndUpdate(
    { owner: req.user?._id },
    {
      $set: {
        thumbnail: thumbnail.secure_url,
      },
    },
    { new: true }
  );

  // send response
  return res.status(200).json(
    new SuccessResponse("Thumbnail uploaded successfully!", {
      video,
    })
  );
};
