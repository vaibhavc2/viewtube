import { Response } from "express";
import { getErrorStatusCode } from "../utils/api/error/error-code.js";
import { getErrorMessage } from "../utils/common/error/error-message.js";

export const errorMiddleware = (error: unknown, res: Response) => {
  const errorMessage = getErrorMessage(error) || "Internal Server Error";

  const statusCode = getErrorStatusCode(error) || 500;

  return res.status(statusCode).json({
    success: false,
    message: errorMessage,
  });
};
