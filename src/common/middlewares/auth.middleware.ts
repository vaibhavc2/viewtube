import envConfig from "@/common/env.config";
import { db } from "@/common/db.client";
import ApiError from "@/common/utils/api-error.util";
import { asyncHandler } from "@/common/utils/async-handler.util";
import { jwtCallback } from "@/common/utils/jwt-callback.util";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

class Auth {
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
        jwtCallback
      );

      // find user in db using the decoded token
      const user = await db.User.findOne({ _id: decodedToken?._id }).select(
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

const auth = new Auth();
export default auth;
