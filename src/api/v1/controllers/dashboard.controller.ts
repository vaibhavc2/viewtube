/* eslint-disable indent */
import ct from "@/common/constants";
import { db } from "@/common/db.client";
import ApiError from "@/common/utils/api-error.util";
import { SuccessResponse } from "@/common/utils/api-response.util";
import { asyncHandler } from "@/common/utils/async-handler.util";
import { Request, Response } from "express";
import mongoose from "mongoose";

export class DashboardController {
  public getChannelStats = asyncHandler(async (req: Request, res: Response) => {
    // get the userId from req.params
    const { userId } = req.params; // get any user's channel stats

    // total video views, total videos
    const video = await db.Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(String(userId)),
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
    const channel = await db.User.aggregate([
      // match the user with the given username in the users collection
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
    const likes = await db.Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(String(userId)),
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
  });

  public getChannelVideos = asyncHandler(
    async (req: Request, res: Response) => {
      const { pagination } = ct;
      // Destructure the query parameters from the request
      const {
        page = pagination.page,
        limit = pagination.pageLimit,
        isPublished, // isPublished is optional, send 1 for true, 0 for false
        isPrivate, // isPrivate is optional, send 1 for true, 0 for false
        query,
        sortBy = pagination.sortBy,
        sortType = pagination.sortType,
      } = req.query;

      // validate
      if (![1, 0].includes(Number(isPublished))) {
        throw new ApiError(400, "Invalid value for isPublished!");
      }

      if (![1, 0].includes(Number(isPrivate))) {
        throw new ApiError(400, "Invalid value for isPrivate!");
      }

      // Define the options for pagination and sorting
      const options = {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        sort: {
          [sortBy as string]: sortType === "desc" ? -1 : 1,
        },
      };

      // Use the aggregatePaginate function from the mongoose-aggregate-paginate-v2 plugin to retrieve the videos.
      // The first argument is a Mongoose aggregation that uses the match object to filter the videos.
      // The second argument is the options object, which sets the pagination and sorting options.
      const videos = await db.Video.aggregatePaginate(
        db.Video.aggregate([
          {
            $match: {
              owner: new mongoose.Types.ObjectId(req.user?._id as string),
              ...(isPublished && { isPublished: Boolean(Number(isPublished)) }),
              ...(isPrivate && { private: Boolean(Number(isPrivate)) }),
              ...(query
                ? {
                    // $or: [
                    //   { title: { $regex: String(query), $options: "i" } },
                    //   { description: { $regex: String(query), $options: "i" } },
                    // ],
                    $or: [
                      {
                        title: {
                          $regex: new RegExp(query as string, "i"),
                          $options: "i",
                        },
                      },
                      {
                        description: {
                          $regex: new RegExp(query as string, "i"),
                          $options: "i",
                        },
                      },
                    ],
                  }
                : {}),
            },
          },
        ]),
        options
      );

      // Send a 200 OK response with the videos and a success message.
      res.status(200).json(
        new SuccessResponse("Videos fetched successfully!", {
          videos,
        })
      );
    }
  );
}
