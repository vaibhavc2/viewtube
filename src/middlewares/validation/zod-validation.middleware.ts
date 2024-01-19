import ApiError from "@/utils/api/error/api-error.util";
import { getErrorMessage } from "@/utils/common/error/error-message.util";
import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

export const zodValidation =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        next(
          new ApiError(
            400,
            `${error.issues.map((issue) => issue.message).join(" ")}`
          )
        );
      } else {
        next(new ApiError(400, `${getErrorMessage(error)}`));
      }
    }
  };
