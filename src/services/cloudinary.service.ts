import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "@/config/config";
import { getErrorMessage } from "@/utils/common/error/error-message.util";
import { wLogger } from "@/utils/log/logger.util";
import { printErrorMessage } from "@/utils/server/error/print-error-message.util";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import fs from "fs";

class CloudinaryService {
  cloudinaryResponse: UploadApiResponse | null;

  constructor(cloud_name: string, api_key: string, api_secret: string) {
    this.cloudinaryResponse = null;

    // configure cloudinary
    cloudinary.config({ cloud_name, api_key, api_secret });
  }

  uploadFileToCloudinary = async (localFilePath: string) => {
    try {
      // check if file path is missing
      if (!localFilePath || localFilePath.length < 1) {
        printErrorMessage(
          "💀⚠️   No File Path Found!!",
          "uploadFileToCloudinary()"
        );
        return null;
      }

      // check if file exists on the local server
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
      // check if file URL is missing
      if (!fileURL || fileURL.length < 1) {
        printErrorMessage(
          "💀⚠️   No File URL Found!!",
          "deleteFileFromCloudinary()"
        );
        return null;
      }

      // delete file from cloudinary
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
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
);
