import { NextFunction, Request, Response } from "express";
import { cache } from "../../helpers/cache/cache.helper.js";

export const cacheUpdater = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "GET") return next();

  if (res.locals.data) {
    const cacheKey = `${req.path}`;
    const { cacheData } = res.locals;
    const stringifiedData = JSON.stringify(cacheData);

    // check if cached data is same as the new data
    if (cache.has(cacheKey) && cache.get(cacheKey) === stringifiedData)
      return next();

    const setCache = cache.set(cacheKey, stringifiedData);

    if (setCache) {
      console.log(`✅🚀   Cache updated for the route: ${req.path}`);
    } else {
      console.log(`⚠️🚀   Unable to update Cache for the route: ${req.path}`);
    }
  }

  next();
};
