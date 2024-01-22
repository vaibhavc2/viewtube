import { NODE_ENV } from "@/config/config";
import { cache } from "@/helpers/cache/cache.helper";
import { wLogger } from "@/utils/log/logger.util";
import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { NextFunction, Request, Response } from "express";

export const cacheSetter = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = `${req.path}`;

    // if method is not GET or cache already has the key, skip
    if (req.method !== "GET" || cache.has(cacheKey)) return next();

    if (res.locals) {
      const cacheData = res.locals;
      const stringifiedData = JSON.stringify(cacheData);

      const setCache = cache.set(cacheKey, stringifiedData);

      if (NODE_ENV === "development") {
        if (setCache) {
          wLogger.info(`✅🚀   Cache set for the route: ${req.path}`);
        } else {
          wLogger.error(
            `⚠️❌   Unable to set Cache for the route: ${req.path}`
          );
        }
      }
    }

    next();
  }
);
