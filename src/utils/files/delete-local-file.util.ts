import fs from "fs";
import { wLogger } from "../log/logger.util";
import { printErrorMessage } from "../server/error/print-error-message.util";

export const deleteLocalFile = (filePath: string) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, function (err) {
      if (err && err.code == "ENOENT") {
        // file doesn't exist
        printErrorMessage(
          `⚠️   File doesn't exist on the path provided: ${filePath}`,
          "deleteLocalFile()"
        );
        reject(err);
      } else if (err && err.code == "EACCES") {
        // permission denied
        printErrorMessage(
          `⚠️   Permission denied while trying to remove the file on the local server. File Path: ${filePath}`,
          "deleteLocalFile()"
        );
        reject(err);
      } else if (err) {
        // other errors, e.g. maybe we don't have enough permission
        printErrorMessage(
          `⚠️   Error occurred while trying to remove the file on the local server. File Path: ${filePath} \n💀   Error: ${err}`,
          "deleteLocalFile()"
        );
        reject(err);
      } else {
        wLogger.info(
          `✅   File removed from the local server. File Path: ${filePath}`
        );
        resolve(true);
      }
    });
  });
};
