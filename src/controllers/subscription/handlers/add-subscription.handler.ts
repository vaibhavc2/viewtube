import { Subscription } from "@/models/subscription.model";
import { User } from "@/models/user.model";
import ApiError from "@/utils/api/error/api-error.util";
import { CreatedResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _addSubscription = async (req: Request, res: Response) => {
  // get username of the channel subscribed to from params
  const { channelUserName } = req.params;

  // find the user: the channel subscribed to
  const user = await User.findOne({ username: channelUserName }, { _id: 1 });

  // check if the channel exists
  if (!user) {
    throw new ApiError(404, "Channel not found");
  }

  // check if the user is already subscribed to the channel
  const alreadySubscribed = await Subscription.findOne({
    subscriber: req.user._id,
    channel: user._id,
  });

  // if already subscribed, throw error
  if (alreadySubscribed) {
    throw new ApiError(400, "Already subscribed");
  }

  // create new subscription
  const subscription = await Subscription.create({
    subscriber: req.user._id,
    channel: user._id,
  });

  // check if created
  const createdSubscription = await Subscription.findById(subscription._id);

  // if not created, throw error
  if (!subscription || !createdSubscription) {
    throw new ApiError(500, "Unexpected Error while subscribing!");
  }

  // send response
  res.status(201).json(
    new CreatedResponse("Subscription created successfully", {
      subscription: createdSubscription,
    })
  );
};
