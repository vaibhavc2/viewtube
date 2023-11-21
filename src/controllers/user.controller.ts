import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/server/handlers/async-handler.util.js";

export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "User registered successfully" });
  }
);
