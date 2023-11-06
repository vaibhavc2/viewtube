import { getErrorMessage } from "../../common/error/error-message.js";

export function printErrorMessage(error: unknown, functionName?: string) {
  console.log(`⚠️ ERROR :: ${functionName} :: ${getErrorMessage(error)}`);
}
