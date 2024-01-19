import { __img_valid_mime_types } from "@/constants/middlewares/mime-types";
import { User } from "@/models/user.model";
import { cloudinaryService } from "@/services/cloudinary.service";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _updateCover = async (req: Request, res: Response) => {
  const coverLocalPath = req.file?.path;
  const coverOldImageURL = req.user?.cover;

  // check if cover file is missing
  if (!coverLocalPath) {
    throw new ApiError(400, "Cover file is missing!");
  }

  // check if cover is a valid image
  if (!__img_valid_mime_types.includes(req.file?.mimetype as string)) {
    throw new ApiError(400, "Invalid Cover Image!");
  }

  // upload cover to cloudinary
  const cover = await cloudinaryService.uploadFileToCloudinary(coverLocalPath);

  // check if cover upload failed
  if (!cover?.secure_url) {
    throw new ApiError(400, "Cover Image upload failed!");
  }

  // update user cover
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        cover: cover.secure_url,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken -__v");

  // delete old cover from cloudinary
  if (coverOldImageURL) {
    await cloudinaryService.deleteFileFromCloudinary(coverOldImageURL);
  }

  // send response
  return res
    .status(200)
    .json(
      new SuccessResponse("User Cover Image updated successfully!", { user })
    );
};
