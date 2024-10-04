import { asyncHandler } from "@/common/utils/async-handler.util.js";
import { db } from "@/common/db.client";
import ApiError from "@/common/utils/api-error.util";
import {
  CreatedResponse,
  SuccessResponse,
} from "@/common/utils/api-response.util";
import { Request, Response } from "express";
import mongoose from "mongoose";

export class SubscriptionController {
  addSubscription = asyncHandler(async (req: Request, res: Response) => {
    // get userId of the channel subscribed to from params
    const { userId } = req.params;

    // verify that the user exists
    if (!(await db.User.findById(userId))) {
      throw new ApiError(404, "Channel not found!");
    }

    // check if the user is trying to subscribe to their own channel
    if (String(userId) === String(req.user?._id)) {
      throw new ApiError(400, "Cannot subscribe to your own channel!");
    }

    // check if the user is already subscribed to the channel
    const alreadySubscribed = await db.Subscription.findOne({
      subscriber: req.user?._id,
      channel: userId,
    });

    // if already subscribed, throw error
    if (alreadySubscribed) {
      throw new ApiError(400, "Already subscribed!");
    }

    // create new subscription
    const subscription = await db.Subscription.create({
      subscriber: req.user?._id,
      channel: userId,
    });

    // check if created
    const createdSubscription = await db.Subscription.findById(
      subscription._id
    );

    // if not created, throw error
    if (!subscription || !createdSubscription) {
      throw new ApiError(500, "Unexpected Error while subscribing!");
    }

    // send response
    res.status(201).json(
      new CreatedResponse("Subscription created successfully!", {
        subscription: createdSubscription,
      })
    );
  });

  removeSubscription = asyncHandler(async (req: Request, res: Response) => {
    // get userId of the channel subscribed to from params
    const { userId } = req.params;

    // verify that the user exists
    if (!(await db.User.findById(userId))) {
      throw new ApiError(404, "Channel not found!");
    }

    // check if the user is subscribed to the channel or not
    const subscription = await db.Subscription.findOne({
      subscriber: req.user?._id,
      channel: userId,
    });

    // if not subscribed, throw error
    if (!subscription) {
      throw new ApiError(400, "Already Not subscribed!");
    }

    // remove subscription
    const result = await db.Subscription.findByIdAndDelete(subscription._id);

    // check if deleted
    if (!result) {
      throw new ApiError(500, "Unexpected Error while unsubscribing!");
    }

    // send response
    res
      .status(200)
      .json(new SuccessResponse("Subscription removed successfully!"));
  });

  getSubscriberCount = asyncHandler(async (req: Request, res: Response) => {
    // get userId
    const { userId } = req.params;

    // get total subs
    const subs = await db.Subscription.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(String(userId)),
        },
      },
      {
        $group: {
          _id: null,
          subscriberCount: {
            $sum: 1,
          },
        },
      },
    ]);

    const { subscriberCount } = subs[0];

    // send response
    res.send(200).json(
      new SuccessResponse("Total Subscribers fetched successfully!", {
        subscriptions: { subscriberCount },
      })
    );
  });
}
