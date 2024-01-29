import { User } from "@/models/user.model";
import { Video } from "@/models/video.model";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const _getChannelStats = async (req: Request, res: Response) => {
  // get the userId from req.params
  const { userId } = req.params; // get any user's channel stats

  // total video views, total videos
  const video = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: null,
        totalViews: {
          $sum: "$views",
        },
        totalVideos: {
          $sum: 1,
        },
      },
    },
  ]);

  const { totalVideos, totalViews } = video[0];

  // channel stats
  const channel = await User.aggregate([
    // match the user with the given username in the users collection
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
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
          // $size is an aggregation operator for counting the number of elements in an array
        },
        subscribedToCount: {
          $size: "$subscribedTo",
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        avatar: 1,
        cover: 1,
        email: 1,
        subscribersCount: 1,
        subscribedToCount: 1,
        channelDescription: 1,
        createdAt: 1,
      },
    },
  ]);

  const {
    fullName,
    username,
    avatar,
    cover,
    email,
    subscribersCount,
    subscribedToCount,
    channelDescription,
    createdAt,
  } = channel[0];

  // total likes of the channel
  const likes = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
      $addFields: {
        likesCount: {
          $size: "$likes",
        },
      },
    },
    {
      $group: {
        _id: null,
        totalLikes: {
          $sum: "$likes",
        },
      },
    },
    {
      $project: {
        totalLikes: 1,
      },
    },
  ]);

  const { totalLikes } = likes[0];

  // send response
  res.status(200).json(
    new SuccessResponse("Channel Stats fetched successfully!", {
      channel: {
        fullName,
        username,
        avatar,
        cover,
        email,
        subscribersCount,
        subscribedToCount,
        channelDescription,
        createdAt,
        totalVideos,
        totalViews,
        totalLikes,
      },
    })
  );
};
