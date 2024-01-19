import { User } from "@/models/user.model";
import ApiResponse, {
  SuccessResponse,
} from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _updateUser = async (req: Request, res: Response) => {
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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
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
  const user = await User.findByIdAndUpdate(
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
    .json(new SuccessResponse("User Details updated successfully!", { user }));
};
