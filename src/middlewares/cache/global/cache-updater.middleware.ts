import { envConfig } from "@/config";
import { cache } from "@/helpers/cache/cache.helper";
import { wLogger } from "@/utils/log/logger.util";
import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { NextFunction, Request, Response } from "express";

export const cacheUpdater = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "GET") return next();

    if (res.locals.data) {
      const cacheKey = `${req.path}`;
      const { cacheData } = res.locals;
      const stringifiedData = JSON.stringify(cacheData);

      if (cache.has(cacheKey)) {
        // check if cached data is same as the new data
        if (cache.get(cacheKey) === stringifiedData) return next();
        // delete already existing stale cache
        else cache.del(cacheKey);
      }

      // set new cache for the route with the new data
      const setCache = cache.set(cacheKey, stringifiedData);

      if (envConfig.isDev()) {
        if (setCache) {
          wLogger.info(`✅🚀   Cache updated for the route: ${req.path}`);
        } else {
          wLogger.error(
            `⚠️❌   Unable to update Cache for the route: ${req.path}`
          );
        }
      }
    }

    next();
  }
);
