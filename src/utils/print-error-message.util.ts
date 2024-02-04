import { getErrorMessage } from "@/utils/error-message.util.js";
import { wLogger } from "@/utils/logger.util.js";

export function printErrorMessage(error: unknown, functionName?: string) {
  wLogger.error(`⚠️   ERROR :: ${functionName} :: ${getErrorMessage(error)}`);
}
