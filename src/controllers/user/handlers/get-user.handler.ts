import { Request, Response } from "express";
import { SuccessResponse } from "../../../utils/api/res/api-response.util.js";

export const _getUser = async (req: Request, res: Response) => {
  const user = req.user;

  return res
    .status(200)
    .json(new SuccessResponse("User profile fetched successfully!", { user }));
};
