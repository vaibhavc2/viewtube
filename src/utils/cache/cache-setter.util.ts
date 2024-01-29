import { envConfig } from "@/config";
import { cache } from "@/helpers/cache/cache.helper";
import { wLogger } from "@/utils/log/logger.util";

export const cacheSetter = async (reqPath: string, cacheData: any) => {
  const cacheKey = `${reqPath}`;

  const stringifiedData = JSON.stringify(cacheData);

  const setCache = cache.set(cacheKey, stringifiedData);

  // console.log(cache.getTtl(cacheKey));

  if (envConfig.isDev()) {
    if (setCache) {
      wLogger.info(`✅🚀   Cache set for the route: ${reqPath}`);
    } else {
      wLogger.error(`⚠️🚀   Unable to set Cache for the route: ${reqPath}`);
    }
  }
};
