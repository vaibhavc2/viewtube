import ApiError from "@/utils/api/error/api-error.util";
import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { NextFunction, Request, Response } from "express";

export const verifyAdminAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized!");
    }

    if (req.user?.role !== "admin") {
      throw new ApiError(403, "You are not authorized to access this route.");
    }

    next();
  }
);
