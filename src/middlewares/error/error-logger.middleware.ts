import { NextFunction, Request, Response } from "express";
import ApiError from "../../utils/api/error/api-error.util.js";
import { wLogger } from "../../utils/log/logger.util.js";

export const errorLogger = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof Error || error instanceof ApiError) {
    wLogger.error(
      `⚠️   Error occurred on the route: ${req.path}\n`,
      error.stack
    );
  } else {
    wLogger.error(
      `⚠️💀   Something went wrong!! Terribly !!\nError occurred on the route: ${req.path} :: `,
      error
    );
  }

  next(error);
};
