import { NextFunction, Request, Response } from "express";

export const asyncHandler = (fn: Function) => {
  async (req: Request, res: Response, next: NextFunction, err?: unknown) => {
    if (err) {
      return next(err);
    }
    return Promise.resolve(fn(req, res, next)).catch((error) => next(error));
  };
};
