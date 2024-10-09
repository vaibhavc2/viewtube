import { UserController } from "@/api/v1/controllers/user.controllers";
import auth from "@/common/middlewares/auth.middleware";
import filesMiddleware from "@/common/middlewares/files.middleware";
import validation from "@/common/middlewares/validation.middleware";
import { validator } from "@/validation";
import { Router } from "express";

class UserRouter {
  public router: Router;
  public controller: UserController;

  constructor() {
    this.router = Router();
    this.controller = new UserController();
    this.routes();
  }

  public routes() {
    /**
     * @openapi
     * /users/register:
     *   post:
     *     tags:
     *       - Users
     *     summary: Register a new user
     *     description: Register a new user
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               fullName:
     *                 type: string
     *                 required: true
     *               username:
     *                 type: string
     *                 required: true
     *               email:
     *                 type: string
     *                 required: true
     *               password:
     *                 type: string
     *                 required: true
     *               avatar:
     *                 type: file
     *                 required: true
     *               cover:
     *                 type: file
     *                 required: false
     *     responses:
     *       201:
     *         description: Success
     *       400:
     *         description: Bad request
     *       409:
     *         description: Conflict
     *       500:
     *         description: Internal server error
     */
    this.router.post(
      "/register",
      filesMiddleware.uploadLocally.fields([
        { name: "avatar", maxCount: 1 },
        { name: "cover", maxCount: 1 },
      ]),
      validation.fields(["fullName", "username", "email", "password"]),
      validation.zod(validator.zod.registration),
      filesMiddleware.uploadAvatarAndCover,
      this.controller.register
    );

    /**
     * @openapi
     * /users/login:
     *   post:
     *     tags:
     *       - Users
     *     summary: Login a user
     *     description: Login a user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 required: true
     *               password:
     *                 type: string
     *                 required: true
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     */
    this.router.patch("/login", this.controller.login);

    /**
     * @openapi
     * /users/refresh:
     *   patch:
     *     tags:
     *       - Users
     *     summary: Refresh user token
     *     description: Refresh user token
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     */
    this.router.patch("/refresh", this.controller.refresh);

    /**
     * @openapi
     * /users/{userId}/channel-profile:
     *   get:
     *     tags:
     *       - Users
     *     summary: Get a user
     *     description: Get a user
     *     parameters:
     *       - name: userId
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
    this.router.get(
      "/:userId/channel-profile",
      this.controller.getChannelProfile
    );

    // the routes below require authentication
    this.router.use(auth.user);

    /**
     * @openapi
     * /users/profile:
     *   get:
     *     tags:
     *       - Users
     *     summary: Get the profile of the logged in user
     *     description: Fetch the profile of the logged in user
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
    this.router.get("/profile", this.controller.getUser);

    /**
     * @openapi
     * /users/watch-history:
     *   get:
     *     tags:
     *       - Users
     *     summary: Get the watch history of the logged in user
     *     description: Fetch the watch history of the logged in user
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
     *       - Bearer: []
     */
    this.router.get("/watch-history", this.controller.getWatchHistory);

    /**
     * @openapi
     * /users/channel-description:
     *   get:
     *     tags:
     *       - Users
     *     summary: Get the channel description of the logged in user
     *     description: Fetch the channel description of the logged in user
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
     *       - Bearer: []
     */
    this.router.get(
      "/channel-description",
      this.controller.getChannelDescription
    );

    /**
     * @openapi
     * /users/logout:
     *   patch:
     *     tags:
     *       - Users
     *     summary: Logout user
     *     description: Logout user
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     *     security:
     *       - Bearer: []
     */
    this.router.patch("/logout", this.controller.logout);

    /**
     * @openapi
     * /users/password:
     *   patch:
     *     tags:
     *       - Users
     *     summary: Change password
     *     description: Change password
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               oldPassword:
     *                   type: string
     *               newPassword:
     *                   type: string
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     *     security:
     *       - Bearer: []
     */
    this.router.patch("/password", this.controller.changePassword);

    /**
     * @openapi
     * /users/profile:
     *   patch:
     *     tags:
     *       - Users
     *     summary: Update profile
     *     description: Update profile
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                   type: string
     *               email:
     *                   type: string
     *               username:
     *                   type: string
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     *     security:
     *       - Bearer: []
     */
    this.router.patch("/profile", this.controller.updateUser);

    /**
     * @openapi
     * /users/avatar:
     *   patch:
     *     tags:
     *       - Users
     *     summary: Update avatar
     *     description: Update avatar
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               avatar:
     *                   type: file
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     *     security:
     *       - Bearer: []
     */
    this.router.patch(
      "/avatar",
      filesMiddleware.uploadLocally.single("avatar"),
      filesMiddleware.uploadImage,
      this.controller.updateAvatar
    );

    /**
     * @openapi
     * /users/cover:
     *   patch:
     *     tags:
     *       - Users
     *     summary: Update cover
     *     description: Update cover
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               cover:
     *                   type: file
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     *     security:
     *       - Bearer: []
     */
    this.router.patch(
      "/cover",
      filesMiddleware.uploadLocally.single("cover"),
      filesMiddleware.uploadImage,
      this.controller.updateCover
    );

    /**
     * @openapi
     * /users/channel-description:
     *   patch:
     *     tags:
     *       - Users
     *     summary: Update channel description
     *     description: Update channel description
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               description:
     *                   type: string
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     *     security:
     *       - Bearer: []
     */
    this.router.patch(
      "/channel-description",
      this.controller.updateChannelDescription
    );

    /**
     * @openapi
     * /users/watch-history/{videoId}:
     *   patch:
     *     tags:
     *       - Users
     *     summary: Update watch history
     *     description: Update watch history
     *     parameters:
     *       - in: path
     *         name: videoId
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     *     security:
     *       - Bearer: []
     */
    this.router.patch(
      "/watch-history/:videoId",
      this.controller.updateWatchHistory
    );

    /**
     * @openapi
     * /users/disable:
     *   patch:
     *     tags:
     *       - Users
     *     summary: Disable user
     *     description: Disable user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               password:
     *                   type: string
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     *     security:
     *       - Bearer: []
     */
    this.router.patch("/disable", this.controller.disableUser);
  }
}

export const usersRouter = new UserRouter().router;
