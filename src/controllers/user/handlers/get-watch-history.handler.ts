import { User } from "@/models/user.model";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const _getWatchHistory = async (req: Request, res: Response) => {
  const user = await User.aggregate([
    // aggregation pipeline code is directly sent to the database and hence, we have to give the mongoDB id and the string that we get from req.user._id
    // mongoDB id is an object and hence, we have to convert it to a string
    { $match: { _id: new mongoose.Types.ObjectId(req.user?._id) } },
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
};
