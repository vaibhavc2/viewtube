import { ACCESS_TOKEN_SECRET as JWT_SECRET } from "@/config/config";
import { __jwt_callback } from "@/constants/jwt/index";
import {
  __unsecured_subscription_routes,
  __unsecured_user_routes,
  __unsecured_video_routes,
} from "@/constants/middlewares/unsecured-routes";
import { User } from "@/models/user.model";
import ApiError from "@/utils/api/error/api-error.util";
import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyAuthentication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // check if route is unsecured, if yes, skip authentication
    if (
      __unsecured_user_routes.includes(req.path) ||
      __unsecured_video_routes.includes(req.path) ||
      __unsecured_subscription_routes.includes(req.path)
    ) {
      return next();
    }

    // check if token exists
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // if not, throw error
    if (!token) {
      throw new ApiError(401, "Unauthorized!");
    }

    // if yes, verify token
    const decodedToken: any = jwt.verify(token, JWT_SECRET, __jwt_callback);

    // find user in db using the decoded token
    const user = await User.findOne({ _id: decodedToken?._id }).select(
      "-password -refreshToken -__v"
    );

    // if user not found, throw error
    if (!user) {
      throw new ApiError(401, "Invalid Access Token!");
    }

    // if user found, attach user to req object
    req.user = user;

    next();
  }
);
