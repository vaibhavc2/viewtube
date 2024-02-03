import { db } from "@/database/models";
import ApiError from "@/utils/api-error.util";
import { SuccessResponse } from "@/utils/api-response.util";
import { Request, Response } from "express";

export const updateVideoPrivacy = async (req: Request, res: Response) => {
  // get video privacy from request body
  const { privacy } = req.body as { privacy: boolean };

  // get videoId from request params
  const { videoId } = req.params;

  // validate privacy
  if (privacy === undefined) {
    throw new ApiError(400, "Privacy is required!");
  }

  // save video privacy to database
  const video = await db.Video.findOneAndUpdate(
    {
      _id: videoId,
      owner: req.user?._id,
    },
    {
      $set: {
        privacy,
      },
    },
    { new: true }
  );

  // send response
  return res.status(200).json(
    new SuccessResponse("Video privacy updated successfully!", {
      video,
    })
  );
};
