import { Subscription } from "@/models/subscription.model";
import { User } from "@/models/user.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const removeSubscription = async (req: Request, res: Response) => {
  // get userId of the channel subscribed to from params
  const { userId } = req.params;

  // verify that the user exists
  if (!(await User.findById(userId))) {
    throw new ApiError(404, "Channel not found!");
  }

  // check if the user is subscribed to the channel or not
  const subscription = await Subscription.findOne({
    subscriber: req.user?._id,
    channel: userId,
  });

  // if not subscribed, throw error
  if (!subscription) {
    throw new ApiError(400, "Already Not subscribed!");
  }

  // remove subscription
  const result = await Subscription.findByIdAndDelete(subscription._id);

  // check if deleted
  if (!result) {
    throw new ApiError(500, "Unexpected Error while unsubscribing!");
  }

  // send response
  res
    .status(200)
    .json(new SuccessResponse("Subscription removed successfully!"));
};
