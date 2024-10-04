import { getErrorMessage } from "@/common/utils/error-message.util.js";
import { logger } from "@/common/utils/logger.util.js";

export function printErrorMessage(error: unknown, functionName?: string) {
  logger.error(`⚠️   ERROR :: ${functionName} :: ${getErrorMessage(error)}`);
}
