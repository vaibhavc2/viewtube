import { envConfig } from "@/config";
import { cache } from "@/helpers/cache/cache.helper";
import { wLogger } from "@/utils/log/logger.util";
import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { NextFunction, Request, Response } from "express";

export const userCacheSetter = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = "user";

    if (req.user && !cache.has(cacheKey)) {
      const cacheData = req.user;
      const stringifiedData = JSON.stringify(cacheData);

      const setCache = cache.set(cacheKey, stringifiedData);

      if (envConfig.isDev()) {
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
  }
);
