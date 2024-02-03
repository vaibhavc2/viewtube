import { db } from "@/database/models";
import { cloudinaryService } from "@/services/cloudinary.service";
import { SuccessResponse } from "@/utils/api-response.util";
import { Request, Response } from "express";

export const updateCover = async (req: Request, res: Response) => {
  // get cover as imageUrl from req.body
  const { imageUrl: cover } = req.body as { imageUrl: string };

  // update user cover
  const coverOldImageURL = req.user?.cover;
  const user = await db.User.findByIdAndUpdate(
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
