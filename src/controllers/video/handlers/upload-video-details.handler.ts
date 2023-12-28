import { Request, Response } from "express";

export const _uploadVideoDetails = async (req: Request, res: Response) => {
  // get video details from request body
  const { title, description } = req.body;
};
