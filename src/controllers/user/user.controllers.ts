import { asyncHandler } from "../../utils/server/handlers/async-handler.util.js";
import { _register } from "./handlers/register.controller.js";

export const registerUser = asyncHandler(_register);
