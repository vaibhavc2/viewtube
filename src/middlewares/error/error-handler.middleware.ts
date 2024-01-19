import ApiError from "@/utils/api/error/api-error.util";
import ApiResponse, {
  InternalServerErrorResponse,
} from "@/utils/api/res/api-response.util";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ApiError) {
    return res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, error.message));
  } else {
    return res.status(500).json(new InternalServerErrorResponse());
  }
};
