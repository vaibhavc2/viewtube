import { Request, Response } from "express";
import { User } from "../../../models/user.model.js";
import { SuccessResponse } from "../../../utils/api/res/api-response.util.js";

export const _updateUser = async (req: Request, res: Response) => {
  // get details from req body
  const { fullName, email, username } = req.body;

  // update user details: get id from req.user object
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
        username,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken -__v");

  // send response
  return res
    .status(200)
    .json(new SuccessResponse("User Details updated successfully!", { user }));
};
