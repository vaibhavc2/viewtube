import { envConfig } from "@/config";
import { __jwt_callback } from "@/constants/jwt/index";
import { User } from "@/models/user.model";
import ApiError from "@/utils/api/error/api-error.util";
import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export class Authentication {
  constructor() {}

  public user = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // check if token exists
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      // if not, throw error
      if (!token) {
        throw new ApiError(401, "Unauthorized!");
      }

      // if yes, verify token
      const decodedToken: any = jwt.verify(
        token,
        envConfig.accessTokenSecret(),
        __jwt_callback
      );

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

  public admin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized!");
      }

      if (req.user?.role !== "admin") {
        throw new ApiError(403, "You are not authorized to access this route.");
      }

      next();
    }
  );
}