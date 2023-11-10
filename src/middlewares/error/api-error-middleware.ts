import { NextFunction, Request, Response } from "express";
import ApiError from "../../utils/api/error/api-error.js";

export const apiErrorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ApiError) {
    console.error(`⚠️   Error occurred on the route: ${req.path} :: `, error); //
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  } else if (error instanceof Error) {
    next(error);
  } else {
    console.error(
      `⚠️💀   Something went wrong!! Terribly !! Error occurred on the route: ${req.path} :: `,
      error
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
