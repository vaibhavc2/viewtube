import { Router } from "express";
import {
  changePassword,
  getUserChannelProfile,
  getUserProfile,
  getUserWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserAvatar,
  updateUserCover,
  updateUserProfile,
} from "../controllers/user/user.controllers.js";
import { verifyAuthentication } from "../middlewares/auth/auth.middleware.js";
import { uploadImagesLocally } from "../middlewares/multer/img-multer.middleware.js";
import { requiredFields } from "../middlewares/validation/required-fields.middleware.js";
import { zodValidation } from "../middlewares/validation/zod-validation.middleware.js";
import { RegisterValidation } from "../models/validation/register.validation.js";

const usersRouter = Router();

//! unsecured routes: no authentication middleware
// **************************************************

//! create routes: POST

usersRouter.route("/register").post(
  uploadImagesLocally.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  requiredFields(["fullName", "username", "email", "password"]),
  zodValidation(RegisterValidation),
  registerUser
);

//! routes for login, logout and refresh tokens: PATCH or POST

usersRouter.route("/login").patch(loginUser);

usersRouter.route("/refresh").patch(refreshAccessToken);

//! secured routes : authentication middleware is compulsory: verifyAuthentication
// **************************************************

usersRouter.route("/logout").patch(verifyAuthentication, logoutUser);

//! update routes: PATCH

usersRouter
  .route("/change-password")
  .patch(verifyAuthentication, changePassword);

usersRouter
  .route("/update/profile")
  .patch(verifyAuthentication, updateUserProfile);

usersRouter
  .route("/update/avatar")
  .patch(
    verifyAuthentication,
    uploadImagesLocally.single("avatar"),
    updateUserAvatar
  );

usersRouter
  .route("/update/cover")
  .patch(
    verifyAuthentication,
    uploadImagesLocally.single("cover"),
    updateUserCover
  );

//! read routes: GET

usersRouter
  .route("/channel/:username")
  .get(verifyAuthentication, getUserChannelProfile);

usersRouter.route("/me/profile").get(verifyAuthentication, getUserProfile);

usersRouter
  .route("/me/watch-history")
  .get(verifyAuthentication, getUserWatchHistory);

export { usersRouter };
