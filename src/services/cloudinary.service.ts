import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "@/config/config";
import { getErrorMessage } from "@/utils/common/error/error-message.util";
import { deleteLocalFile } from "@/utils/files/delete-local-file.util";
import { wLogger } from "@/utils/log/logger.util";
import { printErrorMessage } from "@/utils/server/error/print-error-message.util";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";

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
        // timeout: 600000,
      });

      wLogger.info(`✅   File is uploaded on Cloudinary: ${response.url}`);

      this.cloudinaryResponse = response;
    } catch (error) {
      printErrorMessage(
        `💀⚠️   ${getErrorMessage(error)}`,
        "uploadFileToCloudinary()"
      );
    } finally {
      await deleteLocalFile(localFilePath);

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
