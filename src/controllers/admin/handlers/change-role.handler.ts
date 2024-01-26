import { User } from "@/models/user.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _changeRole = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!userId) {
    throw new ApiError(400, "User ID is required.");
  }

  if (!role) {
    throw new ApiError(400, "Role is required.");
  }

  if (!["user", "admin"].includes(role)) {
    throw new ApiError(400, "Role must be either 'user' or 'admin'.");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      role,
    },
    { new: true }
  );

  if (!user) {
    throw new ApiError(500, "Failed to save user.");
  }

  res
    .status(200)
    .json(
      new SuccessResponse("Successfully changed role of the user!", { user })
    );
};
