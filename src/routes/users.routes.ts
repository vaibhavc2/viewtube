import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const usersRouter = Router();

usersRouter.route("/register").post(registerUser);

export { usersRouter };
