import { NextFunction, Request, Response } from "express";
import { NotFoundResponse } from "../../utils/api/res/api-response.util.js";
import { wLogger } from "../../utils/log/logger.util.js";

export const routeNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  wLogger.error(`⚠️   Route not found: ${req.path}`);
  return res.status(404).json(new NotFoundResponse("Route not found."));
};
