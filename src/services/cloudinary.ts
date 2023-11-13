import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../config/config.js";
import { getErrorMessage } from "../utils/common/error/error-message.js";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const uploadFile = async (localFilePath: string) => {
  try {
    if (!localFilePath) throw new Error("💀⚠️   No File Path Found!!");
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(`✅   File is uploaded on Cloudinary: ${response.url}`);

    return response;
  } catch (error) {
    return getErrorMessage(error);
  } finally {
    // fs.unlinkSync(localFilePath); // remove temp file on local server: synchronously
    fs.unlink(localFilePath, function (err) {
      if (err && err.code == "ENOENT") {
        // file doens't exist
        console.info(
          `⚠️   File doesn't exist on the path provided: ${localFilePath}`
        );
      } else if (err) {
        // other errors, e.g. maybe we don't have enough permission
        console.error(
          `⚠️   Error occurred while trying to remove the file on the local server. File Path: ${localFilePath} \n💀   Error: ${err}`
        );
      } else {
        console.info(
          `✅   File removed from the local server. File Path: ${localFilePath}`
        );
      }
    });
    return null;
  }
};
