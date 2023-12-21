import { Request, Response } from "express";
import { User } from "../../../models/user.model.js";
import { uploadFileToCloudinary } from "../../../services/cloudinary.service.js";
import ApiError from "../../../utils/api/error/api-error.util.js";
import { SuccessResponse } from "../../../utils/api/res/api-response.util.js";

export const _updateCover = async (req: Request, res: Response) => {
  const coverLocalPath = req.file?.path;

  if (!coverLocalPath) {
    throw new ApiError(400, "Cover file is missing!");
  }

  const cover = await uploadFileToCloudinary(coverLocalPath);

  if (!cover?.secure_url) {
    throw new ApiError(400, "Cover Image upload failed!");
  }

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

  return res
    .status(200)
    .json(
      new SuccessResponse("User Cover Image updated successfully!", { user })
    );
};
