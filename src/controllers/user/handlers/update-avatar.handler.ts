import { Request, Response } from "express";
import { User } from "../../../models/user.model.js";
import { uploadFileToCloudinary } from "../../../services/cloudinary.service.js";
import ApiError from "../../../utils/api/error/api-error.util.js";
import { SuccessResponse } from "../../../utils/api/res/api-response.util.js";

export const _updateAvatar = async (req: Request, res: Response) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing!");
  }

  const avatar = await uploadFileToCloudinary(avatarLocalPath);

  if (!avatar?.secure_url) {
    throw new ApiError(400, "Avatar upload failed!");
  }

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

  return res
    .status(200)
    .json(new SuccessResponse("User Avatar updated successfully!", { user }));
};
