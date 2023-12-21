import { NODE_ENV } from "../../config/config.js";
import { cache } from "../../helpers/cache/cache.helper.js";
import { wLogger } from "../../utils/log/logger.util.js";

export const cacheSetter = async (reqPath: string, cacheData: any) => {
  const cacheKey = `${reqPath}`;

  const stringifiedData = JSON.stringify(cacheData);

  const setCache = cache.set(cacheKey, stringifiedData);

  // console.log(cache.getTtl(cacheKey));

  if (NODE_ENV === "development") {
    if (setCache) {
      wLogger.info(`✅🚀   Cache set for the route: ${reqPath}`);
    } else {
      wLogger.error(`⚠️🚀   Unable to set Cache for the route: ${reqPath}`);
    }
  }
};
