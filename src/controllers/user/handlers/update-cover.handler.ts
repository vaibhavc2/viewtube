import { Request, Response } from "express";
import { User } from "../../../models/user.model.js";
import { cloudinaryService } from "../../../services/cloudinary.service.js";
import ApiError from "../../../utils/api/error/api-error.util.js";
import { SuccessResponse } from "../../../utils/api/res/api-response.util.js";

export const _updateCover = async (req: Request, res: Response) => {
  const coverLocalPath = req.file?.path;
  const coverOldImageURL = req.user?.cover;

  // check if cover file is missing
  if (!coverLocalPath) {
    throw new ApiError(400, "Cover file is missing!");
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
