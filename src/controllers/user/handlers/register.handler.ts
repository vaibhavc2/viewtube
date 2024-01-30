import { User } from "@/models/user.model";
import { cloudinaryService } from "@/services/cloudinary.service";
import ApiError from "@/utils/api/error/api-error.util";
import { CreatedResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

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

export const register = async (req: Request, res: Response) => {
  // get user details from frontend
  const { fullName, username, email, password, avatarUrl, coverUrl } = req.body;

  // validation is handled by the middleware
  // images are uploaded to cloudinary by the middleware

  // check if user exists: email, username
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    await cloudinaryService.deleteFileFromCloudinary(avatarUrl);
    await cloudinaryService.deleteFileFromCloudinary(coverUrl);
    throw new ApiError(409, "User with this email or username already exists!");
  }

  // create user object - create entry in db (hashing of pwd is done in the model)
  const user = await User.create({
    fullName,
    username,
    email,
    password,
    avatar: avatarUrl,
    cover: coverUrl,
  });

  // check for user creation
  // select only the required fields: password, refreshToken, __v are not needed here
  const createdUser = await User.findById(user._id).select(
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
};
