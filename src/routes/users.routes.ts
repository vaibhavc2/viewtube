import { Router } from "express";
import {
  getUserProfile,
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

usersRouter.route("/register").post(
  uploadImagesLocally.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  requiredFields(["fullName", "username", "email", "password"]),
  zodValidation(RegisterValidation),
  registerUser
);

usersRouter.route("/login").patch(loginUser);

usersRouter.route("/refresh").patch(refreshAccessToken);

//! secured routes : authentication middleware is compulsory: verifyAuthentication
// **************************************************

usersRouter.route("/logout").patch(verifyAuthentication, logoutUser);

usersRouter.route("/me").get(verifyAuthentication, getUserProfile);
// .get(userCacheGetter, verifyAuthentication, userCacheSetter, getUserProfile);

usersRouter.route("/update").patch(verifyAuthentication, updateUserProfile);

usersRouter
  .route("/update/avatar")
  .patch(
    uploadImagesLocally.single("avatar"),
    verifyAuthentication,
    updateUserAvatar
  );

usersRouter
  .route("/update/cover")
  .patch(
    uploadImagesLocally.single("cover"),
    verifyAuthentication,
    updateUserCover
  );

export { usersRouter };
