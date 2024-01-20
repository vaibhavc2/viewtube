import {
  deleteVideo,
  getAllVideos,
  getRandomVideos,
  getVideo,
  increaseViews,
  togglePublishStatus,
  updateVideoDetails,
  updateVideoPrivacy,
  uploadThumbnail,
  uploadVideo,
  uploadVideoDetails,
} from "@/controllers/video/video.controller";
import { uploadFilesLocally } from "@/middlewares/multer/upload-files-locally.middleware";
import { requiredFields } from "@/middlewares/validation/required-fields.middleware";
import { zodValidation } from "@/middlewares/validation/zod-validation.middleware";
import { VideoDetailsValidation } from "@/validation/video-details.validation";
import { Router } from "express";

const router = Router();

//! get routes: GET

router.route("/:userId/videos").get(getAllVideos);

router.route("/:videoId").get(getVideo);

router.route("/random-videos").get(getRandomVideos);

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

router.route("/:videoId/increase-views").patch(increaseViews);

router.route("/:videoId/toggle-publish-status").patch(togglePublishStatus);

router.route("/:videoId/update-details").patch(updateVideoDetails);

router.route("/:videoId/update-privacy").patch(updateVideoPrivacy);

//! delete routes: DELETE

router.route("/:videoId").delete(deleteVideo);

export default router;
