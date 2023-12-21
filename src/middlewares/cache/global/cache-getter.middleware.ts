import { NextFunction, Request, Response } from "express";
import { NODE_ENV } from "../../../config/config.js";
import { cache } from "../../../helpers/cache/cache.helper.js";
import { wLogger } from "../../../utils/log/logger.util.js";
import { asyncHandler } from "../../../utils/server/handlers/async-handler.util.js";

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
      if (NODE_ENV === "development")
        wLogger.info(`✅🚀   Cache hit for the route: ${req.path}`);

      return res.status(200).json(cachedData);
    }

    if (NODE_ENV === "development")
      wLogger.error(`⚠️🚀   Cache miss for the route: ${req.path}`);

    next();
  }
);
