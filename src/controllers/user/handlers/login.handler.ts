import { Request, Response } from "express";
import { cookieOptions } from "../../../constants/res/index.js";
import { User } from "../../../models/user.model.js";
import ApiError from "../../../utils/api/error/api-error.util.js";
import { SuccessResponse } from "../../../utils/api/res/api-response.util.js";
import { generateTokens } from "../../../utils/generateTokens.util.js";

/**
 * @desc    STEPS: Login user
 *
 * try-catch is not needed since we use asyncHandler in the main controllers file
 * request body -> data
 * email/ username, password
 * find the user in the db
 * if user exists, check if password is correct
 * access token and refresh token: generate
 * send cookies
 * send response
 *
 */

export const _login = async (req: Request, res: Response) => {
  // request body -> data
  const { email, username, password } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "Username or Email is required!");
  }

  // find the user in the db
  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user) {
    throw new ApiError(404, "User not found! Please register first!");
  }

  // if user exists, check if password is correct
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid user credentials!");
  }

  // access token and refresh token: generate, save refresh token to db
  // here, we are passing the user object to the generateTokens function: pass by reference
  const { accessToken, refreshToken } = await generateTokens(user);

  // set or update cache
  // cacheUpdater(req.path, "user", user);

  // send response and cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new SuccessResponse("User logged in successfully!", {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
          cover: user.cover,
          watchHistory: user.watchHistory,
        },
        accessToken,
        refreshToken,
      })
    );
};
