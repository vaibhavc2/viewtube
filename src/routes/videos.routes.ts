import {
  deleteVideo,
  getAllVideos,
  getRandomVideos,
  getVideo,
  increaseViews,
  togglePublishStatus,
  updateThumbnail,
  updateVideo,
  updateVideoDetails,
  updateVideoPrivacy,
  uploadVideo,
} from "@/controllers/video/video.controller";
import { uploadFilesLocally } from "@/middlewares/multer/upload-files-locally.middleware";
import { uploadImageMiddleware } from "@/middlewares/upload/upload-image.middleware";
import { uploadVideoImageMiddleware } from "@/middlewares/upload/upload-video-image.middleware";
import { uploadVideoMiddleware } from "@/middlewares/upload/upload-video.middleware";
import { requiredFields } from "@/middlewares/validation/required-fields.middleware";
import { zodValidation } from "@/middlewares/validation/zod-validation.middleware";
import { VideoDetailsValidation } from "@/validation/video-details.validation";
import { Router } from "express";

const router = Router();

//! get routes: GET

router.route("/videos").get(getAllVideos);

router.route("/:videoId").get(getVideo);

router.route("/random-videos").get(getRandomVideos);

//! create routes: POST

router.route("/upload-video").post(
  uploadFilesLocally.fields([
    { name: "video", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  uploadVideoImageMiddleware,
  requiredFields(["title", "description"]),
  zodValidation(VideoDetailsValidation),
  uploadVideo
);

//! update (upload but actually update) routes: PATCH

router.route("/:videoId/increase-views").patch(increaseViews);

router.route("/:videoId/toggle-publish-status").patch(togglePublishStatus);

router.route("/:videoId/update-details").patch(updateVideoDetails);

router.route("/:videoId/update-privacy").patch(updateVideoPrivacy);

router
  .route("/:videoId/update-video")
  .patch(uploadVideoMiddleware, updateVideo);

router
  .route("/:videoId/update-thumbnail")
  .patch(uploadImageMiddleware, updateThumbnail);

//! delete routes: DELETE

router.route("/:videoId").delete(deleteVideo);

export default router;
