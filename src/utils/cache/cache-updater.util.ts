import { NODE_ENV } from "@/config/config";
import { cache } from "@/helpers/cache/cache.helper";
import { wLogger } from "@/utils/log/logger.util";

export const cacheUpdater = async (
  reqPath: string,
  cacheKey: string,
  cacheData: string
) => {
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
      wLogger.info(
        `✅🚀   Cache updated for the route: ${reqPath}.\n🚀🚀   cache-key : "${cacheKey}"`
      );
    } else {
      wLogger.error(
        `⚠️❌   Unable to update Cache for the route: ${reqPath}.\n🚀🚀   cache-key : "${cacheKey}"`
      );
    }
  }
};
