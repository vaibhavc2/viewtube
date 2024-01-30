import { User } from "@/models/user.model";
import ApiError from "@/utils/api/error/api-error.util";
import ApiResponse from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const getChannelProfile = async (req: Request, res: Response) => {
  // get userId from request params
  const { userId } = req.params;

  // write the aggregation pipeline to get the channel profile of the user with the given username
  const channel = await User.aggregate([
    // match the user with the given id in the users collection
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
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
};
