import { NODE_ENV } from "../../config/config.js";
import { cache } from "../../helpers/cache/cache.helper.js";
import { wLogger } from "../../utils/log/logger.util.js";

export const cacheUpdater = async (reqPath: string, cacheData: string) => {
  const cacheKey = `${reqPath}`;
  const stringifiedData = JSON.stringify(cacheData);

  if (cache.has(cacheKey)) {
    // check if cached data is same as the new data
    if (cache.get(cacheKey) === stringifiedData) return;
    // delete already existing stale cache
    else cache.del(cacheKey);
  }

  // set new cache for the route with the new data
  const setCache = cache.set(cacheKey, stringifiedData);

  if (NODE_ENV === "development") {
    if (setCache) {
      wLogger.info(`✅🚀   Cache updated for the route: ${reqPath}`);
    } else {
      wLogger.error(`⚠️🚀   Unable to update Cache for the route: ${reqPath}`);
    }
  }
};
