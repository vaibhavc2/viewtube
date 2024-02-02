import { envConfig } from "@/config";
import { appConstants } from "@/constants";
import { User } from "@/models/user.model";
import ApiError, { UnauthorizedError } from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { jwtCallback } from "@/utils/jwt/jwt-callback";
import { generateTokens } from "@/utils/tokens/generate-tokens.util";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const refresh = async (req: Request, res: Response) => {
  // get refresh token from cookies
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  // if not found, throw error
  if (!incomingRefreshToken) throw new UnauthorizedError();

  // if found, verify token
  const decodedToken: any = jwt.verify(
    incomingRefreshToken,
    envConfig.refreshTokenSecret(),
    jwtCallback
  );

  // find user in db using the refresh token
  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token!");
  }

  // verify refresh token on db
  if (user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is expired or used!");
  }

  // generate new tokens
  const newTokens = await generateTokens(user);

  // send response and cookies
  return res
    .status(200)
    .cookie(
      "accessToken",
      newTokens.accessToken,
      appConstants.authCookieOptions
    )
    .cookie(
      "refreshToken",
      newTokens.refreshToken,
      appConstants.authCookieOptions
    )
    .json(
      new SuccessResponse("Tokens refreshed successfully!", {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
          cover: user.cover,
        },
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      })
    );
};
