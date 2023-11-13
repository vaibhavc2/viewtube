import { NextFunction, Request, Response } from "express";
import { NODE_ENV } from "../../config/config.js";
import { cache } from "../../helpers/cache/cache.helper.js";

export const cacheSetter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cacheKey = `${req.path}`;

  // if method is not GET or cache already has the key, skip
  if (req.method !== "GET" || cache.has(cacheKey)) return next();

  if (res.locals.cacheData) {
    const { cacheData } = res.locals;
    const stringifiedData = JSON.stringify(cacheData);

    const setCache = cache.set(cacheKey, stringifiedData);

    if (NODE_ENV === "development") {
      if (setCache) {
        console.log(`✅🚀   Cache set for the route: ${req.path}`);
      } else {
        console.log(`⚠️🚀   Unable to set Cache for the route: ${req.path}`);
      }
    }
  }

  next();
};
