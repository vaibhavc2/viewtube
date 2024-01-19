import { User } from "@/models/user.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _deleteUser = async (req: Request, res: Response) => {
  // find and delete user
  const removedUser = await User.findByIdAndDelete(req.user?._id);

  // confirm if the user was removed
  const confirmRemovedUser = await User.findById(req.user?._id);

  // if the user not removed or an error occurred
  if (!removedUser || confirmRemovedUser) {
    throw new ApiError(500, "Unexpected Error while removing user!");
  }

  // send response
  res.status(200).json(new SuccessResponse("User removed successfully"));
};
