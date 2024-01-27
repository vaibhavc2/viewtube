import { User } from "@/models/user.model";
import { cloudinaryService } from "@/services/cloudinary.service";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _updateCover = async (req: Request, res: Response) => {
  // get cover as imageUrl from req.body
  const { imageUrl: cover } = req.body as { imageUrl: string };

  // check if cover upload failed
  if (!cover) {
    throw new ApiError(400, "Cover upload failed!");
  }

  // update user cover
  const coverOldImageURL = req.user?.cover;
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        cover,
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
