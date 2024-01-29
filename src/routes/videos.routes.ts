import { VideoController } from "@/controllers/video/video.controller";
import { verifyAuthentication } from "@/middlewares/auth/auth.middleware";
import { uploadFilesLocally } from "@/middlewares/multer/upload-files-locally.middleware";
import { uploadImageMiddleware } from "@/middlewares/upload/upload-image.middleware";
import { uploadVideoImageMiddleware } from "@/middlewares/upload/upload-video-image.middleware";
import { uploadVideoMiddleware } from "@/middlewares/upload/upload-video.middleware";
import { requiredFields } from "@/middlewares/validation/required-fields.middleware";
import { zodValidation } from "@/middlewares/validation/zod-validation.middleware";
import { VideoDetailsValidation } from "@/validation/video-details.validation";
import { Router } from "express";

class VideoRouter {
  public router: Router;
  public controller: VideoController;

  constructor() {
    this.router = Router();
    this.controller = new VideoController();
    this.routes();
  }

  public routes() {
    this.router.get("/all-videos", this.controller.getAllVideos);
    this.router.get("/random-videos", this.controller.getRandomVideos);
    this.router.post(
      "/upload-video",
      verifyAuthentication, // authentication required
      uploadFilesLocally.fields([
        { name: "video", maxCount: 1 },
        { name: "image", maxCount: 1 },
      ]),
      uploadVideoImageMiddleware,
      requiredFields(["title", "description"]),
      zodValidation(VideoDetailsValidation),
      this.controller.uploadVideo
    );
    this.router.get("/:videoId", this.controller.getVideo);
    this.router.patch(
      "/:videoId/increase-views",
      this.controller.increaseViews
    );

    // the routes below require authentication
    this.router.use(verifyAuthentication);

    this.router.patch(
      "/:videoId/toggle-publish-status",
      this.controller.togglePublishStatus
    );
    this.router.patch(
      "/:videoId/update-details",
      this.controller.updateVideoDetails
    );
    this.router.patch(
      "/:videoId/update-privacy",
      this.controller.updateVideoPrivacy
    );
    this.router.patch(
      "/:videoId/update-video",
      uploadVideoMiddleware,
      this.controller.updateVideo
    );
    this.router.patch(
      "/:videoId/update-thumbnail",
      uploadImageMiddleware,
      this.controller.updateThumbnail
    );
    this.router.delete("/:videoId/delete", this.controller.deleteVideo);
  }
}

export default new VideoRouter().router;
