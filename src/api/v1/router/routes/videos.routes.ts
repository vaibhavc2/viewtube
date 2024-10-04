import { VideoController } from "@/api/v1/controllers/video.controller";
import auth from "@/common/middlewares/auth.middleware";
import filesMiddleware from "@/common/middlewares/files.middleware";
import validation from "@/common/middlewares/validation.middleware";
import { validator } from "@/validation";
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
      auth.user, // authentication required
      filesMiddleware.uploadLocally.fields([
        { name: "video", maxCount: 1 },
        { name: "image", maxCount: 1 },
      ]),
      validation.fields(["title", "description"]),
      validation.zod(validator.zod.videoDetails),
      filesMiddleware.uploadImageAndVideo({ thumbnail: true }),
      this.controller.uploadVideo
    );
    this.router.get("/:videoId", this.controller.getVideo);
    this.router.patch(
      "/:videoId/increase-views",
      this.controller.increaseViews
    );

    // the routes below require authentication
    this.router.use(auth.user);

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
      filesMiddleware.uploadLocally.single("video"),
      filesMiddleware.uploadVideo,
      this.controller.updateVideo
    );
    this.router.patch(
      "/:videoId/update-thumbnail",
      filesMiddleware.uploadLocally.single("thumbnail"),
      filesMiddleware.uploadImage,
      this.controller.updateThumbnail
    );
    this.router.patch(
      "/:videoId/update-categories",
      this.controller.updateVideoCategories
    );
    this.router.delete("/:videoId/delete", this.controller.deleteVideo);
  }
}

export const videosRouter = new VideoRouter().router;
