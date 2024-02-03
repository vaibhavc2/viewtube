import { db } from "@/database/models";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const deleteUser = async (req: Request, res: Response) => {
  // get user id
  const userId = req.params.userId;

  // find user and delete
  await db.User.findByIdAndDelete(userId);

  // confirm deletion
  const user = await db.User.findById(userId);

  // check if user exists
  if (user) throw new ApiError(500, "Unable to delete user.");

  // return success response
  res.status(200).json(
    new SuccessResponse("User deleted successfully!", {
      user: { _id: userId },
    })
  );
};
