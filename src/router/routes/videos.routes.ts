import { VideoController } from "@/controllers/video/video.controller";
import { middlewares } from "@/middlewares";
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
      middlewares.auth.user, // authentication required
      middlewares.files.uploadLocally.fields([
        { name: "video", maxCount: 1 },
        { name: "image", maxCount: 1 },
      ]),
      middlewares.validation.fields(["title", "description"]),
      middlewares.validation.zod(VideoDetailsValidation),
      middlewares.files.uploadImageAndVideo({ thumbnail: true }),
      this.controller.uploadVideo
    );
    this.router.get("/:videoId", this.controller.getVideo);
    this.router.patch(
      "/:videoId/increase-views",
      this.controller.increaseViews
    );

    // the routes below require authentication
    this.router.use(middlewares.auth.user);

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
      middlewares.files.uploadLocally.single("video"),
      middlewares.files.uploadVideo,
      this.controller.updateVideo
    );
    this.router.patch(
      "/:videoId/update-thumbnail",
      middlewares.files.uploadLocally.single("thumbnail"),
      middlewares.files.uploadImage,
      this.controller.updateThumbnail
    );
    this.router.delete("/:videoId/delete", this.controller.deleteVideo);
  }
}

export const videosRouter = new VideoRouter().router;
