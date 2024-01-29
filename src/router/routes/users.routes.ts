import { UserController } from "@/controllers/user/user.controllers";
import { verifyAuthentication } from "@/middlewares/auth/auth.middleware";
import { uploadFilesLocally } from "@/middlewares/multer/upload-files-locally.middleware";
import { uploadImageMiddleware } from "@/middlewares/upload/upload-image.middleware";
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
    this.router.post("/register", this.controller.register);
    this.router.patch("/login", this.controller.login);
    this.router.patch("/refresh", this.controller.refresh);

    // the routes below require authentication
    this.router.use(verifyAuthentication);

    this.router.patch("/logout", this.controller.logout);
    this.router.patch("/change-password", this.controller.changePassword);
    this.router.patch("/update/profile", this.controller.updateUser);
    this.router.patch(
      "/update/avatar",
      uploadFilesLocally.single("avatar"),
      uploadImageMiddleware,
      this.controller.updateAvatar
    );
    this.router.patch(
      "/update/cover",
      uploadFilesLocally.single("cover"),
      uploadImageMiddleware,
      this.controller.updateCover
    );
    this.router.patch(
      "/update/channel/description",
      this.controller.updateChannelDescription
    );
    this.router.patch(
      "/update/watch-history/:videoId",
      this.controller.updateWatchHistory
    );
    this.router.get("/channel/:username", this.controller.getChannelProfile);
    this.router.get("/me/profile", this.controller.getUser);
    this.router.get("/me/watch-history", this.controller.getWatchHistory);
    this.router.get(
      "/channel-description",
      this.controller.getChannelDescription
    );
    this.router.delete("/disable", this.controller.disableUser);
  }
}

export const usersRouter = new UserRouter().router;
