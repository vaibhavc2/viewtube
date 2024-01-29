import { envConfig } from "@/config";
import { __jwt_callback } from "@/constants/jwt/index";
import { __cookie_options } from "@/constants/res/index";
import { User } from "@/models/user.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { generateTokens } from "@/utils/tokens/generate-tokens.util";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const refresh = async (req: Request, res: Response) => {
  // get refresh token from cookies
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  // if not found, throw error
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request!");
  }

  // if found, verify token
  const decodedToken: any = jwt.verify(
    incomingRefreshToken,
    envConfig.refreshTokenSecret(),
    __jwt_callback
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
    .cookie("accessToken", newTokens.accessToken, __cookie_options)
    .cookie("refreshToken", newTokens.refreshToken, __cookie_options)
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
