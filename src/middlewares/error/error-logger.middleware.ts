import ApiError from "@/utils/api/error/api-error.util";
import { wLogger } from "@/utils/log/logger.util";
import { NextFunction, Request, Response } from "express";

export const errorLogger = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof Error || error instanceof ApiError) {
    wLogger.error(
      `⚠️   Error occurred on the route: ${req.path}.\n ${error.stack}`
    );
  } else {
    wLogger.error(
      `💀   Something went wrong!! Terribly !!\n ⚠️   Error occurred on the route: ${req.path}.\n ${error}`
    );
  }

  next(error);
};
