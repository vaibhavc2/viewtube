import { envConfig } from "@/config";
import { cache } from "@/helpers/cache/cache.helper";
import { wLogger } from "@/utils/log/logger.util";
import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { NextFunction, Request, Response } from "express";

export const cacheGetter = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") return next();
    // console.log("hello");

    const key = `${req.path}`;

    // if cache does not have the key, skip
    console.log(cache.has(key));
    if (!cache.has(key)) return next();

    const cachedResponse = cache.get(key) as any;
    const cachedData = JSON.parse(cachedResponse);
    console.log(cachedData);

    if (cachedData) {
      if (envConfig.isDev())
        wLogger.info(`✅🚀   Cache hit for the route: ${req.path}`);

      return res.status(200).json(cachedData);
    }

    if (envConfig.isDev())
      wLogger.error(`⚠️❌   Cache miss for the route: ${req.path}`);

    next();
  }
);
