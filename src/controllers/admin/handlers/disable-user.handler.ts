import { User } from "@/models/user.model";
import { UserNotFoundError } from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const disableUser = async (req: Request, res: Response) => {
  // get user id
  const userId = req.params.userId;

  // find user and update
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        disabled: true,
      },
    },
    { new: true }
  );

  // check if user exists
  if (!user) throw new UserNotFoundError();

  // return success response
  res
    .status(200)
    .json(new SuccessResponse("User disabled successfully!", { user }));
};
