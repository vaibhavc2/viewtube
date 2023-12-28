import { Request, Response } from "express";
import ApiError from "../../../utils/api/error/api-error.util.js";
import { SuccessResponse } from "../../../utils/api/res/api-response.util.js";

export const _updateChannelDescription = async (
  req: Request,
  res: Response
) => {
  const { description } = req.body;

  if (!description) {
    throw new ApiError(400, "Description is required");
  }

  req.user.channelDescription = description;

  const result = await req.user.save({ validateBeforeSave: false });

  if (!result) {
    throw new ApiError(500, "Unable to update channel description");
  }

  return res
    .status(200)
    .json(
      new SuccessResponse("Channel description updated successfully", {
        channelDescription: result.channelDescription,
      })
    );
};
