import { __img_valid_mime_types } from "@/constants/middlewares/mime-types";
import { User } from "@/models/user.model";
import { cloudinaryService } from "@/services/cloudinary.service";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _updateAvatar = async (req: Request, res: Response) => {
  const avatarLocalPath = req.file?.path;
  const avatarOldImageURL = req.user?.avatar;

  // check if avatar file is missing
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing!");
  }

  // check if avatar is a valid image
  if (!__img_valid_mime_types.includes(req.file?.mimetype as string)) {
    throw new ApiError(400, "Invalid Avatar Image!");
  }

  // upload avatar to cloudinary
  const avatar =
    await cloudinaryService.uploadFileToCloudinary(avatarLocalPath);

  // check if avatar upload failed
  if (!avatar?.secure_url) {
    throw new ApiError(400, "Avatar upload failed!");
  }

  // update user avatar
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.secure_url,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken -__v");

  // delete old avatar from cloudinary
  if (avatarOldImageURL) {
    await cloudinaryService.deleteFileFromCloudinary(avatarOldImageURL);
  }

  // send response
  return res
    .status(200)
    .json(new SuccessResponse("User Avatar updated successfully!", { user }));
};
