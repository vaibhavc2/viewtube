import { NextFunction, Request, Response } from "express";
import { NODE_ENV } from "../../../config/config.js";
import { cache } from "../../../helpers/cache/cache.helper.js";
import { wLogger } from "../../../utils/log/logger.util.js";

export const userCacheSetter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cacheKey = "user";

  if (req.user && !cache.has(cacheKey)) {
    const cacheData = req.user;
    const stringifiedData = JSON.stringify(cacheData);

    const setCache = cache.set(cacheKey, stringifiedData);

    if (NODE_ENV === "development") {
      if (setCache) {
        wLogger.info(
          `✅🚀   Cache set with key: ${cacheKey}. Route: "${req.path}"`
        );
      } else {
        wLogger.error(
          `⚠️❌   Unable to set Cache with key: ${cacheKey}. Route: "${req.path}"`
        );
      }
    }
  }

  next();
};
