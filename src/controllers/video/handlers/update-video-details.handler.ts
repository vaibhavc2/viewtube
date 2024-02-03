import { db } from "@/database/models";
import ApiError from "@/utils/api-error.util";
import { SuccessResponse } from "@/utils/api-response.util";
import { Request, Response } from "express";

export const updateVideoDetails = async (req: Request, res: Response) => {
  // get video details from request body
  const { title, description } = req.body as {
    title: string;
    description: string;
  };

  // get videoId from request params
  const { videoId } = req.params;

  // validate details here also
  if (!title && !description) {
    throw new ApiError(
      400,
      "Atleast one of Title and Description are required!"
    );
  }

  // validate title
  if (title && title.length < 3) {
    throw new ApiError(400, "Title must be at least 3 characters.");
  }

  // validate description
  if (description && description.length < 3) {
    throw new ApiError(400, "Description must be at least 3 characters.");
  }

  // check if any of the details are valid
  let validDetails = [];
  if (title) validDetails.push(title);
  if (description) validDetails.push(description);

  // save video details to database
  const video = await db.Video.findOneAndUpdate(
    {
      _id: videoId,
      owner: req.user?._id,
    },
    {
      $set: { ...validDetails },
    },
    { new: true }
  );

  // send response
  return res.status(200).json(
    new SuccessResponse("Video details uploaded successfully!", {
      video,
    })
  );
};
