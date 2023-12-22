import { Request, Response } from "express";
import { User } from "../../../models/user.model.js";
import { cloudinaryService } from "../../../services/cloudinary.service.js";
import ApiError from "../../../utils/api/error/api-error.util.js";
import { SuccessResponse } from "../../../utils/api/res/api-response.util.js";

export const _updateAvatar = async (req: Request, res: Response) => {
  const avatarLocalPath = req.file?.path;
  const avatarOldImageURL = req.user?.avatar;

  // check if avatar file is missing
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing!");
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
