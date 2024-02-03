import { appConstants } from "@/constants";
import { db } from "@/database/models";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

/**
 * @desc    STEPS: Logout user
 *
 * try-catch is not needed since we use asyncHandler in the main controllers file
 * clear cookies
 * clear refresh token from db
 * send response
 *
 */

export const logout = async (req: Request, res: Response) => {
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
    .clearCookie("accessToken", appConstants.authCookieOptions)
    .clearCookie("refreshToken", appConstants.authCookieOptions)
    .json(new SuccessResponse("User logged out successfully!", {}));
};
