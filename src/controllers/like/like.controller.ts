import { asyncHandler } from "@/utils/async-handler.util";
import { addLike } from "./handlers/add-like.handler";
import { getLikeHistory } from "./handlers/get-like-history";
import { getLikesCount } from "./handlers/get-likes-count.handler";
import { removeLike } from "./handlers/remove-like.handler";

export class LikeController {
  constructor() {}

  public addLike = asyncHandler(addLike);
  public removeLike = asyncHandler(removeLike);
  public getLikesCount = asyncHandler(getLikesCount);
  public getLikeHistory = asyncHandler(getLikeHistory);
}
