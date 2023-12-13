import { asyncHandler } from "../../utils/server/handlers/async-handler.util.js";
import { _login } from "./handlers/login.handler.js";
import { _logout } from "./handlers/logout.handler.js";
import { _register } from "./handlers/register.handler.js";

export const registerUser = asyncHandler(_register);
export const loginUser = asyncHandler(_login);
export const logoutUser = asyncHandler(_logout);
