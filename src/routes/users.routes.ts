import { Router } from "express";
import { registerUser } from "../controllers/user/user.controllers.js";
import { uploadFileLocally } from "../middlewares/config/multer.middleware.js";
import { zodValidation } from "../middlewares/validation/zod-validation.middleware.js";
import { RegisterValidation } from "../models/validation/register.validation.js";

const usersRouter = Router();

// using multer middleware before the controller
usersRouter.route("/register").post(
  uploadFileLocally.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "cover",
      maxCount: 1,
    },
  ]),
  zodValidation(RegisterValidation),
  registerUser
);

export { usersRouter };
