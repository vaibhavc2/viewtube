import ApiError from "@/common/utils/api-error.util";
import ApiResponse, {
  InternalServerErrorResponse,
  NotFoundResponse,
} from "@/common/utils/api-response.util";
import { logger } from "@/common/utils/logger.util";
import { NextFunction, Request, Response } from "express";

class ErrorMiddleware {
  public handler = (
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

  public logger = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (error instanceof Error || error instanceof ApiError) {
      logger.error(
        `⚠️   Error occurred on the route: ${req.path}.\n ${error.stack}`
      );
    } else {
      logger.error(
        `💀   Something went wrong!! Terribly !!\n ⚠️   Error occurred on the route: ${req.path}.\n ${error}`
      );
    }

    next(error);
  };

  public routeNotFound = (req: Request, res: Response, next: NextFunction) => {
    logger.error(`⚠️   Route not found: ${req.path}`);
    return res.status(404).json(new NotFoundResponse("Route not found."));
  };
}

const errorMiddleware = new ErrorMiddleware();
export default errorMiddleware;
