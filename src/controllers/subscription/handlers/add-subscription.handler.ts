import { Subscription } from "@/models/subscription.model";
import { User } from "@/models/user.model";
import ApiError from "@/utils/api/error/api-error.util";
import { CreatedResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const _addSubscription = async (req: Request, res: Response) => {
  // get username of the channel subscribed to from params
  const { channelUserName } = req.params;

  // find the user: the channel subscribed to
  const user = await User.findOne({ channelUserName }, { _id: 1 });

  // check if the channel exists
  if (!user) {
    throw new ApiError(404, "Channel not found");
  }

  // get id of the channel subscribed to
  const channelId = new mongoose.Types.ObjectId(user._id);

  // get id of the user subscribing from the request
  const subscriberId = new mongoose.Types.ObjectId(req.user._id);

  // check if the user is already subscribed to the channel
  const alreadySubscribed = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  // if already subscribed, throw error
  if (alreadySubscribed) {
    throw new ApiError(400, "Already subscribed");
  }

  // create new subscription
  const subscription = new Subscription({
    subscriber: subscriberId,
    channel: channelId,
  });

  // confirm if the subscription was created
  const createdSubscription = await Subscription.findById(subscription._id);

  // if not created, throw error
  if (!subscription || !createdSubscription) {
    throw new ApiError(500, "Unexpected Error while subscribing!");
  }

  // send response
  res.status(201).json(
    new CreatedResponse("Subscription created successfully", {
      createdSubscription,
    })
  );
};
