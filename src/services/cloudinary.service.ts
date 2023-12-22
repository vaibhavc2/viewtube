import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import fs from "fs";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../config/config.js";
import { getErrorMessage } from "../utils/common/error/error-message.util.js";
import { wLogger } from "../utils/log/logger.util.js";
import { printErrorMessage } from "../utils/server/error/print-error-message.util.js";

class CloudinaryService {
  cloudinaryResponse: UploadApiResponse | null;

  constructor(cloud_name: string, api_key: string, api_secret: string) {
    this.cloudinaryResponse = null;

    cloudinary.config({ cloud_name, api_key, api_secret });
  }

  uploadFileToCloudinary = async (localFilePath: string) => {
    try {
      if (!localFilePath || localFilePath.length < 1) {
        printErrorMessage(
          "💀⚠️   No File Path Found!!",
          "uploadFileToCloudinary()"
        );
        return null;
      }
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });

      wLogger.info(`✅   File is uploaded on Cloudinary: ${response.url}`);

      this.cloudinaryResponse = response;
    } catch (error) {
      printErrorMessage(
        `💀⚠️   ${getErrorMessage(error)}`,
        "uploadFileToCloudinary()"
      );
    } finally {
      // fs.unlinkSync(localFilePath); // remove temp file on local server: synchronously
      fs.unlink(localFilePath, function (err) {
        if (err && err.code == "ENOENT") {
          // file doesn't exist
          printErrorMessage(
            `⚠️   File doesn't exist on the path provided: ${localFilePath}`,
            "fs.unlink()"
          );
        } else if (err) {
          // other errors, e.g. maybe we don't have enough permission
          printErrorMessage(
            `⚠️   Error occurred while trying to remove the file on the local server. File Path: ${localFilePath} \n💀   Error: ${err}`,
            "fs.unlink()"
          );
        } else {
          wLogger.info(
            `✅   File removed from the local server. File Path: ${localFilePath}`
          );
        }
      });

      return this.cloudinaryResponse;
    }
  };

  deleteFileFromCloudinary = async (fileURL: string) => {
    try {
      if (!fileURL || fileURL.length < 1) {
        printErrorMessage(
          "💀⚠️   No File URL Found!!",
          "deleteFileFromCloudinary()"
        );
        return null;
      }

      const response = await cloudinary.uploader.destroy(fileURL);

      wLogger.info(`✅   File is deleted from Cloudinary: ${response}`);

      this.cloudinaryResponse = response;
    } catch (error) {
      printErrorMessage(
        `💀⚠️   ${getErrorMessage(error)}`,
        "deleteFileFromCloudinary()"
      );
    } finally {
      return this.cloudinaryResponse;
    }
  };
}

export const cloudinaryService = new CloudinaryService(
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME
);
