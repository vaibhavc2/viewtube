import { Router } from "express";
import {
  changePassword,
  getChannelDescription,
  getUserChannelProfile,
  getUserProfile,
  getUserWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateChannelDescription,
  updateUserAvatar,
  updateUserCover,
  updateUserProfile,
} from "../controllers/user/user.controllers.js";
import { uploadImagesLocally } from "../middlewares/multer/img-multer.middleware.js";
import { requiredFields } from "../middlewares/validation/required-fields.middleware.js";
import { zodValidation } from "../middlewares/validation/zod-validation.middleware.js";
import { RegisterValidation } from "../models/validation/register.validation.js";

const router = Router();

//! create routes: POST

router.route("/register").post(
  uploadImagesLocally.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  requiredFields(["fullName", "username", "email", "password"]),
  zodValidation(RegisterValidation),
  registerUser
);

//! routes for login, logout and refresh tokens: PATCH or POST

router.route("/login").patch(loginUser);

router.route("/refresh").patch(refreshAccessToken);

router.route("/logout").patch(logoutUser);

//! update routes: PATCH

router.route("/change-password").patch(changePassword);

router.route("/update/profile").patch(updateUserProfile);

router
  .route("/update/avatar")
  .patch(uploadImagesLocally.single("avatar"), updateUserAvatar);

router
  .route("/update/cover")
  .patch(uploadImagesLocally.single("cover"), updateUserCover);

//! read routes: GET

router.route("/channel/:username").get(getUserChannelProfile);

router.route("/me/profile").get(getUserProfile);

router.route("/me/watch-history").get(getUserWatchHistory);

router.route("/channel-description").get(getChannelDescription);

router.route("/update/channel/description").patch(updateChannelDescription);

export default router;
