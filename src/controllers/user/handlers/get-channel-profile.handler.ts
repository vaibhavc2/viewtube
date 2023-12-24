import { Request, Response } from "express";
import { User } from "../../../models/user.model.js";
import ApiError from "../../../utils/api/error/api-error.util.js";
import ApiResponse from "../../../utils/api/res/api-response.util.js";

export const _getChannelProfile = async (req: Request, res: Response) => {
  // get the channel profile of the user with the given username

  // req.params is an object containing properties mapped to the named route “parameters”. For example, if you have the route /user/:name, then the “name” property is available as req.params.name. This object defaults to {}.
  const { username } = req.params;

  // check if the username is missing
  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing!");
  }

  // write the aggregation pipeline to get the channel profile of the user with the given username
  const channel = await User.aggregate([
    // match the user with the given username in the users collection
    {
      $match: {
        username: username?.trim().toLowerCase(),
      },
    },
    // lookup the subscriptions collection to get the subscribers of the user with the given username
    {
      $lookup: {
        from: "subsriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    // lookup the subscriptions collection to get the channels subscribed to by the user with the given username
    {
      $lookup: {
        from: "subsriptions",
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
        subscribedToCount: req.user?.username === username ? 1 : 0,
        isSubscribed: 1,
        subscribers: 0,
        subscribedTo: 0,
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
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Channel profile fetched successfully!", channel[0])
    );
};
