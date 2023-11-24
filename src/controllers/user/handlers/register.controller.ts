import { UploadApiResponse } from "cloudinary";
import { NextFunction, Request, Response } from "express";
import { __img_valid_mime_types } from "../../../constants/middlewares/index.js";
import { User } from "../../../models/user.model.js";
import { uploadFileToCloudinary } from "../../../services/cloudinary.service.js";
import ApiError from "../../../utils/api/error/api-error.util.js";
import ApiResponse from "../../../utils/api/res/api-response.util.js";

/**
 * @desc    STEPS: Register a new user
 *
 * try-catch is not needed since we use asyncHandler in the main controllers file
 * get user details from frontend
 * validation is done again in the backend
 * check if user exists: email, username
 * check for images: avatar, cover : avatar is compulsory
 * check if avatar and cover are valid images: avatar is compulsory
 * upload images to cloudinary
 * check if avatar and cover are valid images: avatar is compulsory
 * create user object - create entry in db (hashing of pwd is done in the model)
 * check for user creation
 * remove password and refreshToken from user object
 * send response
 *
 */

export const _register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get user details from frontend
  const { fullName, username, email, password } = req.body;

  // validation is handled by the middleware
  // console.log(req.body);

  // check if user exists: email, username
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email or username already exists!");
  }

  // check for images: avatar, cover : avatar is compulsory
  const files = req?.files as { [fieldname: string]: Express.Multer.File[] };
  // console.log(files);
  const avatarLocalPath = files?.avatar[0]?.path;
  const coverLocalPath = files?.cover[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar Image is required!");

  // check if avatar and cover are valid images: avatar is compulsory
  if (!__img_valid_mime_types.includes(files?.avatar[0]?.mimetype)) {
    throw new ApiError(400, "Invalid Avatar Image!");
  }
  if (coverLocalPath) {
    if (!__img_valid_mime_types.includes(files?.cover[0]?.mimetype)) {
      throw new ApiError(400, "Invalid Cover Image!");
    }
  }

  // upload images to cloudinary
  const avatar: UploadApiResponse | null =
    await uploadFileToCloudinary(avatarLocalPath);
  let cover: UploadApiResponse | null = null;
  if (coverLocalPath) {
    cover = await uploadFileToCloudinary(coverLocalPath);
  }

  // check if avatar and cover are valid images: avatar is compulsory
  // console.log(avatar);
  if (!avatar)
    throw new ApiError(
      500,
      "Something went wrong while uploading Avatar Image to server!"
    );

  if (coverLocalPath) {
    if (!cover)
      throw new ApiError(
        500,
        "Something went wrong while uploading Cover Image to server!"
      );
  }

  // create user object - create entry in db (hashing of pwd is done in the model)
  const user = await User.create({
    fullName,
    username,
    email,
    password,
    avatar: avatar.url,
    cover: cover?.url || "",
  });

  // check for user creation
  // select only the required fields: password, refreshToken are not needed
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!user || !createdUser)
    throw new ApiError(500, "Something went wrong while creating the user!");

  // send response
  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully!", createdUser));
};
