import { NextFunction, Request, Response } from "express";
import { getErrorStatusCode } from "../utils/error/error-code.js";
import { getErrorMessage } from "../utils/error/error-message.js";

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorMessage = getErrorMessage(error) || "Internal Server Error";

  const statusCode = getErrorStatusCode(error) || 500;

  return res.status(statusCode).json({
    success: false,
    message: errorMessage
  });
};
