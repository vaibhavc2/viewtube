import { __img_valid_mime_types } from "@/constants/middlewares/mime-types";
import { cloudinaryService } from "@/services/cloudinary.service";
import ApiError from "@/utils/api/error/api-error.util";
import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { NextFunction, Request, Response } from "express";

export const uploadImageMiddleware = asyncHandler(
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
