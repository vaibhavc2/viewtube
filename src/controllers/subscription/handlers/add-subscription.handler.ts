import { Subscription } from "@/models/subscription.model";
import { User } from "@/models/user.model";
import ApiError from "@/utils/api/error/api-error.util";
import { CreatedResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const addSubscription = async (req: Request, res: Response) => {
  // get userId of the channel subscribed to from params
  const { userId } = req.params;

  // verify that the user exists
  if (!(await User.findById(userId))) {
    throw new ApiError(404, "Channel not found!");
  }

  // check if the user is trying to subscribe to their own channel
  if (userId.toString() === req.user?._id.toString()) {
    throw new ApiError(400, "Cannot subscribe to your own channel!");
  }

  // check if the user is already subscribed to the channel
  const alreadySubscribed = await Subscription.findOne({
    subscriber: req.user._id,
    channel: userId,
  });

  // if already subscribed, throw error
  if (alreadySubscribed) {
    throw new ApiError(400, "Already subscribed!");
  }

  // create new subscription
  const subscription = await Subscription.create({
    subscriber: req.user._id,
    channel: userId,
  });

  // check if created
  const createdSubscription = await Subscription.findById(subscription._id);

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
};
