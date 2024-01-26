import { User } from "@/models/user.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _disableUser = async (req: Request, res: Response) => {
  // get user id
  const userId = req.user?._id;

  // find user and update
  const user = await User.findByIdAndUpdate(
    userId,
    { disabled: true },
    { new: true }
  );

  // check if user exists
  if (!user) throw new ApiError(404, "User not found! Unable to disable user.");

  // return success response
  res
    .status(200)
    .json(new SuccessResponse("User disabled successfully!", { user }));
};
