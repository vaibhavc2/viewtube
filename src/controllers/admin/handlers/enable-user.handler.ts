import { User } from "@/models/user.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const enableUser = async (req: Request, res: Response) => {
  // get user id
  const userId = req.params.userId;

  // find user and update
  const user = await User.findByIdAndUpdate(
    userId,
    { disabled: false },
    { new: true }
  );

  // check if user exists
  if (!user) throw new ApiError(404, "User not found! Unable to enable user.");

  // return success response
  res
    .status(200)
    .json(new SuccessResponse("User enabled successfully!", { user }));
};
