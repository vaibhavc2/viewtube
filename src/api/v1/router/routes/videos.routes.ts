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
    /**
     * @openapi
     * /videos/all:
     *   get:
     *     tags:
     *       - Videos
     *     summary: Get all videos
     *     description: Get all videos
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     */
    this.router.get("/all", this.controller.getAllVideos);

    /**
     * @openapi
     * /videos/random:
     *   get:
     *     tags:
     *       - Videos
     *     summary: Get random videos
     *     description: Get random videos
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     */
    this.router.get("/random", this.controller.getRandomVideos);

    /**
     * @openapi
     * /videos/upload:
     *   post:
     *     tags:
     *       - Videos
     *     summary: Upload video
     *     description: Upload video
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *               type: object
     *               properties:
     *                 title:
     *                   type: string
     *                   required: true
     *                 description:
     *                   type: string
     *                   required: true
     *                 video:
     *                   type: file
     *                   required: true
     *                 image:
     *                   type: file
     *                   required: true
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     */
    this.router.post(
      "/upload",
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

    /**
     * @openapi
     * /videos/{videoId}:
     *   get:
     *     tags:
     *       - Videos
     *     summary: Get video
     *     description: Get video
     *     parameters:
     *       - name: videoId
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     */
    this.router.get("/:videoId", this.controller.getVideo);

    /**
     * @openapi
     * /videos/{videoId}/views:
     *   patch:
     *     tags:
     *       - Videos
     *     summary: Increase video views
     *     description: Increase video views
     *     parameters:
     *       - name: videoId
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     */
    this.router.patch("/:videoId/views", this.controller.increaseViews);

    // the routes below require authentication
    this.router.use(auth.user);

    /**
     * @openapi
     * /videos/{videoId}/publish-status:
     *   patch:
     *     tags:
     *       - Videos
     *     summary: Toggle video publish status
     *     description: Toggle video publish status
     *     parameters:
     *       - name: videoId
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     *     security:
     *       - bearerAuth: []
     */
    this.router.patch(
      "/:videoId/publish-status",
      this.controller.togglePublishStatus
    );

    /**
     * @openapi
     * /videos/{videoId}/details:
     *   patch:
     *     tags:
     *       - Videos
     *     summary: Update video details
     *     description: Update video details
     *     parameters:
     *       - name: videoId
     *         in: path
     *         required: true
     *         type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *               description:
     *                 type: string
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     *     security:
     *       - bearerAuth: []
     */
    this.router.patch("/:videoId/details", this.controller.updateVideoDetails);

    /**
     * @openapi
     * /videos/{videoId}/privacy:
     *   patch:
     *     tags:
     *       - Videos
     *     summary: Update video privacy
     *     description: Update video privacy
     *     parameters:
     *       - name: videoId
     *         in: path
     *         required: true
     *         type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               privacy:
     *                 type: boolean
     *                 enum: [true, false]
     *                 required: true
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     *     security:
     *       - bearerAuth: []
     */
    this.router.patch("/:videoId/privacy", this.controller.updateVideoPrivacy);

    /**
     * @openapi
     * /videos/{videoId}/video:
     *   patch:
     *     tags:
     *       - Videos
     *     summary: Update video
     *     description: Update video
     *     parameters:
     *       - name: videoId
     *         in: path
     *         required: true
     *         type: string
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               video:
     *                 type: file
     *                 required: true
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - multipart/form-data
     *     produces:
     *       - application/json
     */
    this.router.patch(
      "/:videoId/video",
      filesMiddleware.uploadLocally.single("video"),
      filesMiddleware.uploadVideo,
      this.controller.updateVideo
    );

    /**
     * @openapi
     * /videos/{videoId}/thumbnail:
     *   patch:
     *     tags:
     *       - Videos
     *     summary: Update video thumbnail
     *     description: Update video thumbnail
     *     parameters:
     *       - name: videoId
     *         in: path
     *         required: true
     *         type: string
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               thumbnail:
     *                 type: file
     *                 required: true
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - multipart/form-data
     *     produces:
     *       - application/json
     */
    this.router.patch(
      "/:videoId/thumbnail",
      filesMiddleware.uploadLocally.single("thumbnail"),
      filesMiddleware.uploadImage,
      this.controller.updateThumbnail
    );

    /**
     * @openapi
     * /videos/{videoId}/categories:
     *   patch:
     *     tags:
     *       - Videos
     *     summary: Update video categories
     *     description: Update video categories
     *     parameters:
     *       - name: videoId
     *         in: path
     *         required: true
     *         type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               categories:
     *                 type: array
     *                 items:
     *                   type: string
     *                 required: true
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     */
    this.router.patch(
      "/:videoId/categories",
      this.controller.updateVideoCategories
    );

    /**
     * @openapi
     * /videos/{videoId}/delete:
     *   delete:
     *     tags:
     *       - Videos
     *     summary: Delete video
     *     description: Delete video
     *     parameters:
     *       - name: videoId
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     */
    this.router.delete("/:videoId/delete", this.controller.deleteVideo);
  }
}

export const videosRouter = new VideoRouter().router;
