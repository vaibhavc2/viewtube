import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { _getChannelStats } from "./handlers/get-channel-stats.handler";
import { _getChannelVideos } from "./handlers/get-channel-videos.handler";

export const getChannelStats = asyncHandler(_getChannelStats);
export const getChannelVideos = asyncHandler(_getChannelVideos);
