import { asyncHandler } from "@/common/utils/async-handler.util";
import { db } from "@/common/db.client";
import { cloudinaryService } from "@/common/services/cloudinary.service";
import ApiError, {
  UnauthorizedError,
  UserNotFoundError,
} from "@/common/utils/api-error.util";
import ApiResponse, {
  CreatedResponse,
  SuccessResponse,
} from "@/common/utils/api-response.util";
import { Request, Response } from "express";
import ct from "@/common/constants";
import { generateTokens } from "@/common/utils/generate-tokens.util";
import env from "@/common/env.config";
import { jwtCallback } from "@/common/utils/jwt-callback.util";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const { REFRESH_TOKEN_SECRET } = env;

export class UserController {
  /**
   * @desc    STEPS: Register a new user
   *
   * try-catch is not needed since we use asyncHandler in the main controllers file
   * get user details from frontend
   * validation is done again in the backend
   * check if user exists: email, username
   * upload images to cloudinary
   * check if avatar and cover are valid images: avatar is compulsory
   * create user object - create entry in db (hashing of pwd is done in the model)
   * check for user creation
   * remove password and refreshToken from user object
   * send response
   *
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    // get user details from frontend
    const { fullName, username, email, password, avatarUrl, coverUrl } =
      req.body;

    // validation is handled by the middleware
    // images are uploaded to cloudinary by the middleware

    // check if user exists: email, username
    const existedUser = await db.User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      await cloudinaryService.deleteFileFromCloudinary(avatarUrl);
      await cloudinaryService.deleteFileFromCloudinary(coverUrl);
      throw new ApiError(
        409,
        "User with this email or username already exists!"
      );
    }

    // create user object - create entry in db (hashing of pwd is done in the model)
    const user = await db.User.create({
      fullName,
      username,
      email,
      password,
      avatar: avatarUrl,
      cover: coverUrl,
    });

    // check for user creation
    // select only the required fields: password, refreshToken, __v are not needed here
    const createdUser = await db.User.findById(user._id).select(
      "-password -refreshToken -__v"
    );
    if (!user || !createdUser) {
      await cloudinaryService.deleteFileFromCloudinary(avatarUrl);
      await cloudinaryService.deleteFileFromCloudinary(coverUrl);
      throw new ApiError(500, "Something went wrong while creating the user!");
    }

    // send response
    return res.status(201).json(
      new CreatedResponse("User registered successfully!", {
        user: createdUser,
      })
    );
  });

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
  login = asyncHandler(async (req: Request, res: Response) => {
    // request body -> data
    const { email, username, password } = req.body;

    if (!email && !username) {
      throw new ApiError(400, "Username or Email is required!");
    }

    // find the user in the db
    const user = await db.User.findOne({ $or: [{ email }, { username }] });

    if (!user) throw new UserNotFoundError();

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
      .cookie("accessToken", accessToken, ct.authCookieOptions)
      .cookie("refreshToken", refreshToken, ct.authCookieOptions)
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
  });

  /**
   * @desc    STEPS: Logout user
   *
   * try-catch is not needed since we use asyncHandler in the main controllers file
   * clear cookies
   * clear refresh token from db
   * send response
   *
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    // clear refresh token from db
    await db.User.findByIdAndUpdate(
      req.user?._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      { new: true }
    );

    // clear cookies and send response
    return res
      .status(200)
      .clearCookie("accessToken", ct.authCookieOptions)
      .clearCookie("refreshToken", ct.authCookieOptions)
      .json(new SuccessResponse("User logged out successfully!", {}));
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    // get refresh token from cookies
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    // if not found, throw error
    if (!incomingRefreshToken) throw new UnauthorizedError();

    // if found, verify token
    const decodedToken: any = jwt.verify(
      incomingRefreshToken,
      REFRESH_TOKEN_SECRET,
      jwtCallback
    );

    // find user in db using the refresh token
    const user = await db.User.findById(decodedToken?._id);

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
      .cookie("accessToken", newTokens.accessToken, ct.authCookieOptions)
      .cookie("refreshToken", newTokens.refreshToken, ct.authCookieOptions)
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
  });

  getUser = asyncHandler(async (req: Request, res: Response) => {
    // get user from req object (set by verifyAuthentication middleware)
    const user = req.user;

    // check if user exists
    if (!user) throw new UserNotFoundError();

    return res
      .status(200)
      .json(
        new SuccessResponse("User profile fetched successfully!", { user })
      );
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    // get details from req body
    const { fullName, email, username } = req.body;

    // validation: check which of fullName, email, username are empty, if not empty, check if they are valid
    if (!fullName || !email || !username) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            "No field(s) to update. Please fill in atleast one of the required fields."
          )
        );
    }

    // check if email is valid
    if (email && !ct.emailRegex.test(email)) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Please enter a valid email address."));
    }

    // check if username is valid
    if (username && username.length < 3) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Username must be at least 3 characters."));
    }
    const usernameRegex = /^[a-z\d_]*$/;
    if (username && !usernameRegex.test(username)) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            "Username can only contain: lowercase letters, numbers, and underscore characters"
          )
        );
    }

    // check if fullName is valid
    if (fullName && fullName.length < 3) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Full Name must be at least 3 characters."));
    }
    const fullNameRegex = /^[a-zA-Z\s]*$/;
    if (fullName && !fullNameRegex.test(fullName)) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, "Full Name can only contain: letters and spaces")
        );
    }

    // check if any of the details are valid
    let validDetails = [];
    if (fullName) validDetails.push(fullName);
    if (email) validDetails.push(email);
    if (username) validDetails.push(username);

    // update user details: get id from req.user object
    const user = await db.User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          ...validDetails,
        },
      },
      {
        new: true,
      }
    ).select("-password -refreshToken -__v");

    // send response
    return res
      .status(200)
      .json(
        new SuccessResponse("User Details updated successfully!", { user })
      );
  });

  /**
   * @desc    STEPS: Change password
   *
   * try-catch is not needed since we use asyncHandler in the main controllers file
   * request body -> old password, new password, confirm password
   * if new password and confirm password are not the same, throw error
   * if old password and new password are the same, throw error
   * user authentication is already checked using a middleware: get it from req.user
   * if old password is correct, change the password else throw error
   * send response
   *
   */
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // check if new password and confirm password are not same
    if (newPassword !== confirmPassword) {
      throw new ApiError(400, "New password must match the confirm password!");
    }

    // check if old password and new password are same
    if (oldPassword === newPassword) {
      throw new ApiError(400, "New password cannot be same as old password!");
    }

    // verify if req.user exists
    if (!req.user) {
      throw new ApiError(500, "User not found in request object!");
    }

    // retrieve user from req object
    const user = req.user;

    // check if old password is correct
    const isCorrect = await user.comparePassword(oldPassword);

    // if old password is not correct, throw error
    if (!isCorrect) {
      throw new ApiError(400, "Old password is incorrect!");
    }

    // change the password
    user.password = newPassword;

    // save the user
    const result = await user.save({ validateBeforeSave: false });

    // check if user was saved successfully
    if (!result) {
      throw new ApiError(500, "Unable to change password!");
    }

    // send response
    res
      .status(200)
      .json(new SuccessResponse("Password changed successfully!", {}));
  });

  disableUser = asyncHandler(async (req: Request, res: Response) => {
    // get user id
    const userId = req.user?._id;

    // find user and update
    const user = await db.User.findByIdAndUpdate(
      userId,
      {
        $set: {
          disabled: true,
        },
      },
      { new: true }
    );

    // check if user exists
    if (!user) throw new UserNotFoundError();

    // return success response
    res
      .status(200)
      .json(new SuccessResponse("User disabled successfully!", { user }));
  });

  updateAvatar = asyncHandler(async (req: Request, res: Response) => {
    // get avatar as imageUrl from req.body
    const { imageUrl: avatar } = req.body as { imageUrl: string };

    // update user avatar
    const avatarOldImageURL = req.user?.avatar;
    const user = await db.User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar,
        },
      },
      {
        new: true,
      }
    ).select("-password -refreshToken -__v");

    // delete old avatar from cloudinary
    if (avatarOldImageURL) {
      await cloudinaryService.deleteFileFromCloudinary(avatarOldImageURL);
    }

    // send response
    return res
      .status(200)
      .json(new SuccessResponse("User Avatar updated successfully!", { user }));
  });

  updateCover = asyncHandler(async (req: Request, res: Response) => {
    // get cover as imageUrl from req.body
    const { imageUrl: cover } = req.body as { imageUrl: string };

    // update user cover
    const coverOldImageURL = req.user?.cover;
    const user = await db.User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          cover,
        },
      },
      {
        new: true,
      }
    ).select("-password -refreshToken -__v");

    // delete old cover from cloudinary
    if (coverOldImageURL) {
      await cloudinaryService.deleteFileFromCloudinary(coverOldImageURL);
    }

    // send response
    return res
      .status(200)
      .json(
        new SuccessResponse("User Cover Image updated successfully!", { user })
      );
  });

  getChannelProfile = asyncHandler(async (req: Request, res: Response) => {
    // get userId from request params
    const { userId } = req.params;

    // write the aggregation pipeline to get the channel profile of the user with the given username
    const channel = await db.User.aggregate([
      // match the user with the given id in the users collection
      {
        $match: {
          _id: new mongoose.Types.ObjectId(String(userId)),
        },
      },
      // lookup the subscriptions collection to get the subscribers of the user with the given username
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      // lookup the subscriptions collection to get the channels subscribed to by the user with the given username
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      // add the subscribersCount, subscribedToCount and isSubscribed fields to the user object
      {
        $addFields: {
          subscribersCount: {
            $size: "$subscribers",
            // $size is an aggregation operator for counting the number of elements in an array
          },
          subscribedToCount: {
            $size: "$subscribedTo",
          },
          isSubscribed: {
            $cond: {
              // check if the current user is subscribed to the channel
              if: {
                $in: [req.user?._id, "$subscribers.subscriber"],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      // project the fields that we want to return
      {
        $project: {
          // 0 means false, 1 means true : these are the fields that we want to return
          fullName: 1,
          username: 1,
          avatar: 1,
          cover: 1,
          email: 1,
          subscribersCount: 1,
          subscribedToCount: 1,
          isSubscribed: 1,
          channelDescription: 1,
        },
      },
      // aggregation pipeline ends here
      // it returns an array of objects
      // till here, we have array containing only one object (because we have only one user with the given username)
    ]);

    // check if the channel profile is missing
    if (!channel?.length) {
      throw new ApiError(404, "Channel not found or does not exist!");
    }

    // return the response with the channel profile
    return res.status(200).json(
      new ApiResponse(200, "Channel profile fetched successfully!", {
        channel: channel[0],
      })
    );
  });

  getChannelDescription = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json(
      new SuccessResponse("Channel description retrieved successfully", {
        channelDescription: req.user?.channelDescription || "",
      })
    );
  });

  updateChannelDescription = asyncHandler(
    async (req: Request, res: Response) => {
      const { description } = req.body;

      if (!description) {
        throw new ApiError(400, "Description is required");
      }

      if (!req.user) throw new UnauthorizedError();

      req.user.channelDescription = String(description);

      const result = await req.user.save({ validateBeforeSave: false });

      if (!result) {
        throw new ApiError(500, "Unable to update channel description");
      }

      return res.status(200).json(
        new SuccessResponse("Channel description updated successfully", {
          channelDescription: result.channelDescription,
        })
      );
    }
  );

  getWatchHistory = asyncHandler(async (req: Request, res: Response) => {
    const user = await db.User.aggregate([
      // aggregation pipeline code is directly sent to the database and hence, we have to give the mongoDB id and the string that we get from req.user._id
      // mongoDB id is an object and hence, we have to convert it to a string
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user?._id as string),
        },
      },
      // get the watch history of the user
      // the watchHistory field of the user object will be an array of video objects
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
          // nested pipeline to lookup the owner of each video in the watch history
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                // nested pipeline to project only the required fields of the owner
                // TODO: learn how to do this in outer pipeline, and not in nested
                pipeline: [
                  {
                    $project: {
                      fullName: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                owner: {
                  // $first: "$owner"
                  $arrayElemAt: ["$owner", 0],
                  // we can use any of the above two aggregation operators to get the first element of the owner array
                },
              },
            },
          ],
        },
      },
    ]);

    return res.status(200).json(
      new SuccessResponse("Watch history fetched successfully!", {
        watchHistory: user[0].watchHistory,
      })
    );
  });

  updateWatchHistory = asyncHandler(async (req: Request, res: Response) => {
    // get the video id from the request params
    const { videoId } = req.params;

    // check if the video id is missing
    if (!videoId) {
      throw new ApiError(400, "Video id is required");
    }

    if (!req.user) throw new UnauthorizedError();

    const user = req.user;

    // check if the video is already present in the watch history
    const videoIndex = user.watchHistory.findIndex(
      (video: any) => String(video.videoId) === String(videoId)
    );

    // if the video is already present in the watch history, then remove it
    if (videoIndex !== -1) {
      user.watchHistory.splice(videoIndex, 1);
    }

    // add the video to the beginning of the watch history
    user.watchHistory.unshift({ videoId, watchedAt: new Date() });

    // limit the watch history to a const no of videos
    if (user.watchHistory.length > ct.limitWatchHistory)
      user.watchHistory = user.watchHistory.slice(0, ct.limitWatchHistory);

    //? => no need to sort the watch history as we are adding the video to the beginning of the array
    // sort the watch history by the date of watchedAt field
    // user.watchHistory.sort(
    //   (a, b) => b.watchedAt.getTime() - a.watchedAt.getTime()
    // );

    // save the user object
    const result = await user.save({ validateBeforeSave: false });

    // check if the user object was saved successfully
    if (!result) {
      throw new ApiError(500, "Unable to update watch history");
    }

    // send the response
    return res.status(200).json(
      new SuccessResponse("Watch history updated successfully", {
        watchHistory: user.watchHistory,
      })
    );
  });
}
