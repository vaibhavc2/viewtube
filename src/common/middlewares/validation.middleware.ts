import { db } from "@/common/db.client";
import ApiError, { RequiredBodyError } from "@/common/utils/api-error.util";
import { asyncHandler } from "@/common/utils/async-handler.util";
import { getErrorMessage } from "@/common/utils/error-message.util";
import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

class ValidationMiddleware {
  public ids = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { commentId, videoId, tweetId } = req.query;

      // check if one of tweetId, videoId, commentId is provided
      if (!tweetId && !videoId && !commentId) {
        throw new ApiError(
          400,
          "One of tweetId, videoId, commentId is required"
        );
      }

      // there should be only one of tweetId, videoId, commentId
      if (
        (tweetId && videoId) ||
        (tweetId && commentId) ||
        (videoId && commentId)
      ) {
        throw new ApiError(
          400,
          "Only one of tweetId, videoId, commentId is allowed"
        );
      }

      // check if the ids are real
      if (videoId) {
        const video = await db.Video.findById(videoId);
        if (!video) throw new ApiError(400, "Wrong Video ID!");
      } else if (tweetId) {
        const tweet = await db.Tweet.findById(tweetId);
        if (!tweet) throw new ApiError(400, "Wrong Tweet ID!");
      } else if (commentId) {
        const comment = await db.Comment.findById(commentId);
        if (!comment) throw new ApiError(400, "Wrong Comment ID!");
      }

      next();
    }
  );

  public fields = (fields: string[]) =>
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const missingFields = [];
      const keys = Object.keys(req.body); // Included fields

      // Checks if every required field is in the body
      for (const field of fields)
        if (!keys.includes(field)) missingFields.push(field);

      // If there are missing fields then run next error middleware
      if (missingFields.length)
        return next(new RequiredBodyError(missingFields));

      // If no missing fields then run router code
      return next();
    });

  public zod = (schema: AnyZodObject) =>
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
    });
}

const validation = new ValidationMiddleware();
export default validation;
