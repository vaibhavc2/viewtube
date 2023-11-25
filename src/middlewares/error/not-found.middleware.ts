import { NextFunction, Request, Response } from "express";
import { NotFoundResponse } from "../../utils/api/res/api-response.util.js";

export const routeNotFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(404).json(new NotFoundResponse());
};
