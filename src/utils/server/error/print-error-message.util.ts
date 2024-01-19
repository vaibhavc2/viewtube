import { getErrorMessage } from "@/utils/common/error/error-message.util.js";
import { wLogger } from "@/utils/log/logger.util.js";

export function printErrorMessage(error: unknown, functionName?: string) {
  wLogger.error(`⚠️ ERROR :: ${functionName} :: ${getErrorMessage(error)}`);
}
