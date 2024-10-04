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
    this.router.patch("/login", this.controller.login);
    this.router.patch("/refresh", this.controller.refresh);

    // the routes below require authentication
    this.router.use(auth.user);

    this.router.patch("/logout", this.controller.logout);
    this.router.patch("/change-password", this.controller.changePassword);
    this.router.patch("/update/profile", this.controller.updateUser);
    this.router.patch(
      "/update/avatar",
      filesMiddleware.uploadLocally.single("avatar"),
      filesMiddleware.uploadImage,
      this.controller.updateAvatar
    );
    this.router.patch(
      "/update/cover",
      filesMiddleware.uploadLocally.single("cover"),
      filesMiddleware.uploadImage,
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
    this.router.get("/channel/:userId", this.controller.getChannelProfile);
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
