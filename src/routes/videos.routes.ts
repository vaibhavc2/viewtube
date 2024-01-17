import { Router } from "express";
import {
  getVideos,
  uploadThumbnail,
  uploadVideo,
  uploadVideoDetails,
} from "../controllers/video/video.controller.js";
import { uploadFilesLocally } from "../middlewares/multer/upload-files-locally.middleware.js";
import { requiredFields } from "../middlewares/validation/required-fields.middleware.js";
import { zodValidation } from "../middlewares/validation/zod-validation.middleware.js";
import { VideoDetailsValidation } from "../validation/video-details.validation.js";

const router = Router();

//! get routes: GET

router.route("/all-videos").get(getVideos);

//! create routes: POST

router
  .route("/upload-video-details")
  .post(
    requiredFields(["title", "description"]),
    zodValidation(VideoDetailsValidation),
    uploadVideoDetails
  );

//! update (upload but actually update) routes: PATCH

router
  .route("/upload-video")
  .patch(uploadFilesLocally.single("video"), uploadVideo);

router
  .route("/upload-thumbnail")
  .patch(uploadFilesLocally.single("thumbnail"), uploadThumbnail);

export default router;
