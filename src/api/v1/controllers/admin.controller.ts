import { asyncHandler } from "@/common/utils/async-handler.util";
import { db } from "@/common/db.client";
import ApiError, { UserNotFoundError } from "@/common/utils/api-error.util";
import {
  CreatedResponse,
  SuccessResponse,
} from "@/common/utils/api-response.util";
import { Request, Response } from "express";
import { generateFakeData } from "@/common/services/external/fake-data.service";

export class AdminController {
  changeRole = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!userId) {
      throw new ApiError(400, "User ID is required.");
    }

    if (!role) {
      throw new ApiError(400, "Role is required.");
    }

    if (!["user", "admin"].includes(role)) {
      throw new ApiError(400, "Role must be either 'user' or 'admin'.");
    }

    const user = await db.User.findByIdAndUpdate(
      userId,
      {
        $set: { role },
      },
      { new: true }
    );

    if (!user) {
      throw new ApiError(500, "Failed to save user.");
    }

    res
      .status(200)
      .json(
        new SuccessResponse("Successfully changed role of the user!", { user })
      );
  });

  changeUserStatus = asyncHandler(async (req: Request, res: Response) => {
    // get user id
    const userId = req.params.userId;

    // get status
    const status = req.body.status; // "enabled" or "disabled"
    const disabled = status === "disabled" ? true : false;

    // find user and update
    const user = await db.User.findByIdAndUpdate(
      userId,
      {
        $set: { disabled },
      },
      { new: true }
    );

    // check if user exists
    if (!user) throw new UserNotFoundError();

    // return success response
    res
      .status(200)
      .json(new SuccessResponse("User status changed successfully!", { user }));
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    // get user id
    const userId = req.params.userId;

    // find user and delete
    await db.User.findByIdAndDelete(userId);

    // confirm deletion
    const user = await db.User.findById(userId);

    // check if user exists
    if (user) throw new ApiError(500, "Unable to delete user.");

    // return success response
    res.status(200).json(
      new SuccessResponse("User deleted successfully!", {
        user: { _id: userId },
      })
    );
  });

  updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
    // get user id
    const userId = req.params.userId;
    // get status
    const status = req.body.status; // "enabled" or "disabled"

    if (!status || !["enabled", "disabled"].includes(status)) {
      throw new ApiError(400, "Status must be either 'enabled' or 'disabled'.");
    }

    // find user and update
    const user = await db.User.findByIdAndUpdate(
      userId,
      {
        $set: {
          disabled: status === "disabled" ? true : false,
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

  //! only for testing in development | Don't use in production

  seedFakeUsers = asyncHandler(async (req: Request, res: Response) => {
    const { num = 50, drop = 0 } = req.query;

    if (isNaN(+num)) {
      throw new ApiError(400, "Number of users must be a number.");
    }
    if (isNaN(+drop)) {
      throw new ApiError(400, "Drop must be a number. (representing boolean)");
    }

    const users = await generateFakeData.users(+num);

    if (+drop) {
      await db.User.collection.drop();
    }

    const insertedUsers = await db.User.insertMany(users);

    if (!insertedUsers) {
      throw new ApiError(500, "Failed to seed users.");
    }

    res.status(201).json(
      new CreatedResponse("Successfully seeded users.", {
        users: insertedUsers,
      })
    );
  });

  seedFakeVideos = asyncHandler(async (req: Request, res: Response) => {
    const { num = 50, drop = 0 } = req.query;

    // validate query params
    if (isNaN(+num)) {
      throw new ApiError(400, "Number of users must be a number.");
    }
    if (isNaN(+drop)) {
      throw new ApiError(400, "Drop must be a number. (representing boolean)");
    }

    if (+drop === 1) {
      await db.User.collection.drop();
    }

    // generate videos
    const videos = await generateFakeData.videos(+num, String(req.user?._id));

    // save videos
    const result = await db.Video.insertMany(videos);

    if (!result) {
      throw new ApiError(500, "Failed to seed videos.");
    }

    // return success response
    res
      .status(200)
      .json(new SuccessResponse("Videos seeded successfully!", { videos }));
  });
}
