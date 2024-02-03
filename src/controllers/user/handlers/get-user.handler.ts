import { UserNotFoundError } from "@/utils/api-error.util";
import { SuccessResponse } from "@/utils/api-response.util";
import { Request, Response } from "express";

export const getUser = async (req: Request, res: Response) => {
  // get user from req object (set by verifyAuthentication middleware)
  const user = req.user;

  // check if user exists
  if (!user) throw new UserNotFoundError();

  return res
    .status(200)
    .json(new SuccessResponse("User profile fetched successfully!", { user }));
};
