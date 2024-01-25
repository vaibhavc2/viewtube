import { asyncHandler } from "@/utils/server/handlers/async-handler.util.js";
import { _addSubscription } from "./handlers/add-subscription.handler";
import { _getTotalSubscribers } from "./handlers/get-total-subscribers.handler";
import { _removeSubscription } from "./handlers/remove-subscription.handler";

export const addSubscription = asyncHandler(_addSubscription);
export const removeSubscription = asyncHandler(_removeSubscription);
export const getTotalSubscribers = asyncHandler(_getTotalSubscribers);
