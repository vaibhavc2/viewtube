import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _getChannelDescription = async (req: Request, res: Response) => {
  return res.status(200).json(
    new SuccessResponse("Channel description retrieved successfully", {
      channelDescription: req.user?.channelDescription || "",
    })
  );
};
