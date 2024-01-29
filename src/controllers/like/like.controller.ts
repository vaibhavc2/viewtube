import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { _addLike } from "./handlers/add-like.handler";
import { _getLikeHistory } from "./handlers/get-like-history";
import { _getLikesCount } from "./handlers/get-likes-count.handler";
import { _removeLike } from "./handlers/remove-like.handler";

export const addLike = asyncHandler(_addLike);
export const removeLike = asyncHandler(_removeLike);
export const getLikesCount = asyncHandler(_getLikesCount);
export const getLikeHistory = asyncHandler(_getLikeHistory);
