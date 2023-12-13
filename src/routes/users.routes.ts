import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
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

usersRouter.route("/login").post(loginUser);

// secured routes : authentication middleware is compulsory
usersRouter.route("/logout").post(verifyAuthentication, logoutUser);

export { usersRouter };
