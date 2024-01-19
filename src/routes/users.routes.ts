import {
  changePassword,
  deleteUser,
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
  updateWatchHistory,
} from "@/controllers/user/user.controllers";
import { uploadFilesLocally } from "@/middlewares/multer/upload-files-locally.middleware";
import { requiredFields } from "@/middlewares/validation/required-fields.middleware";
import { zodValidation } from "@/middlewares/validation/zod-validation.middleware";
import { RegisterValidation } from "@/validation/register.validation";
import { Router } from "express";

const router = Router();

//! create routes: POST

router.route("/register").post(
  uploadFilesLocally.fields([
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
  .patch(uploadFilesLocally.single("avatar"), updateUserAvatar);

router
  .route("/update/cover")
  .patch(uploadFilesLocally.single("cover"), updateUserCover);

router.route("/update/channel/description").patch(updateChannelDescription);

router.route("/update/watch-history/:videoId").patch(updateWatchHistory);

//! read routes: GET

router.route("/channel/:username").get(getUserChannelProfile);

router.route("/me/profile").get(getUserProfile);

router.route("/me/watch-history").get(getUserWatchHistory);

router.route("/channel-description").get(getChannelDescription);

// ! delete routes: DELETE

router.route("/delete").delete(deleteUser);

export default router;
