import { UserController } from "@/controllers/user/user.controllers";
import { middlewares } from "@/middlewares";
import { RegisterValidation } from "@/validation/register.validation";
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
      middlewares.files.uploadLocally.fields([
        { name: "avatar", maxCount: 1 },
        { name: "cover", maxCount: 1 },
      ]),
      middlewares.validation.fields([
        "fullName",
        "username",
        "email",
        "password",
      ]),
      middlewares.validation.zod(RegisterValidation),
      middlewares.files.uploadAvatarAndCover,
      this.controller.register
    );
    this.router.patch("/login", this.controller.login);
    this.router.patch("/refresh", this.controller.refresh);

    // the routes below require authentication
    this.router.use(middlewares.auth.user);

    this.router.patch("/logout", this.controller.logout);
    this.router.patch("/change-password", this.controller.changePassword);
    this.router.patch("/update/profile", this.controller.updateUser);
    this.router.patch(
      "/update/avatar",
      middlewares.files.uploadLocally.single("avatar"),
      middlewares.files.uploadImage,
      this.controller.updateAvatar
    );
    this.router.patch(
      "/update/cover",
      middlewares.files.uploadLocally.single("cover"),
      middlewares.files.uploadImage,
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
