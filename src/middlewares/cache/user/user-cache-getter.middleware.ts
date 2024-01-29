import { envConfig } from "@/config";
import { cache } from "@/helpers/cache/cache.helper";
import { wLogger } from "@/utils/log/logger.util";
import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { NextFunction, Request, Response } from "express";

export const userCacheGetter = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") return next();

    const key = "user";

    // if cache does not have the key, skip
    if (!cache.has(key)) return next();

    const cachedResponse = cache.get(key) as any;
    const cachedData = JSON.parse(cachedResponse);
    // console.log(cachedData);

    if (cachedData) {
      if (envConfig.isDev())
        wLogger.info(`✅🚀   Cache hit for the route: ${req.path}`);

      req.user = cachedData;
      return next();
    }

    if (envConfig.isDev())
      wLogger.error(`⚠️❌   Cache miss for the route: ${req.path}`);

    next();
  }
);
