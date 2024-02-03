import { asyncHandler } from "@/utils/async-handler.util.js";
import { addSubscription } from "./handlers/add-subscription.handler";
import { getSubscriberCount } from "./handlers/get-subscriber-count.handler";
import { removeSubscription } from "./handlers/remove-subscription.handler";

export class SubscriptionController {
  constructor() {}

  public addSubscription = asyncHandler(addSubscription);
  public removeSubscription = asyncHandler(removeSubscription);
  public getSubscriberCount = asyncHandler(getSubscriberCount);
}
