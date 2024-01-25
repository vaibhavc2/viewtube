import { Subscription } from "@/models/subscription.model";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const _getTotalSubscribers = async (req: Request, res: Response) => {
  // get userId
  const { userId } = req.params;

  // get total subs
  const subs = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: null,
        totalSubscribers: {
          $sum: 1,
        },
      },
    },
  ]);

  const { totalSubscribers } = subs[0];

  // send response
  res.send(200).json(
    new SuccessResponse("Total Subscribers fetched successfully!", {
      totalSubscribers,
    })
  );
};
