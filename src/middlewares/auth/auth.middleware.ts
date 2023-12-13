import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET as JWT_SECRET } from "../../config/config.js";
import { User } from "../../models/user.model.js";
import ApiError from "../../utils/api/error/api-error.util.js";
import { asyncHandler } from "../../utils/server/handlers/async-handler.util.js";

export const verifyAuthentication = asyncHandler(
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
    const decodedToken: any = jwt.verify(token, JWT_SECRET);

    // find user in db using the decoded token
    const user = await User.findOne({ _id: decodedToken?._id }).select(
      "-password -refreshToken"
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
