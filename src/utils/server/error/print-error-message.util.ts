import { getErrorMessage } from "../../common/error/error-message.util.js";

export function printErrorMessage(error: unknown, functionName?: string) {
  console.log(`⚠️ ERROR :: ${functionName} :: ${getErrorMessage(error)}`);
}
