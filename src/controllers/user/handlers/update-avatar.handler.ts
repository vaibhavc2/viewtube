import { User } from "@/models/user.model";
import { cloudinaryService } from "@/services/cloudinary.service";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const updateAvatar = async (req: Request, res: Response) => {
  // get avatar as imageUrl from req.body
  const { imageUrl: avatar } = req.body as { imageUrl: string };

  // update user avatar
  const avatarOldImageURL = req.user?.avatar;
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar,
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
