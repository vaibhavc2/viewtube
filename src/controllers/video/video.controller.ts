import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { _deleteVideo } from "./handlers/delete-video.handler";
import { _getAllVideos } from "./handlers/get-all-videos.handler";
import { _getRandomVideos } from "./handlers/get-random-videos.handler";
import { _getVideo } from "./handlers/get-video.handler";
import { _increaseViews } from "./handlers/increase-views.handler";
import { _togglePublishStatus } from "./handlers/toggle-publish-status";
import { _updateVideoDetails } from "./handlers/update-video-details.handler";
import { _updateVideoPrivacy } from "./handlers/update-video-privacy.handler";
import { _uploadThumbnail } from "./handlers/upload-thumbnail.handler";
import { _uploadVideoDetails } from "./handlers/upload-video-details.handler";
import { _uploadVideo } from "./handlers/upload-video.handler";

export const uploadVideo = asyncHandler(_uploadVideo);
export const uploadThumbnail = asyncHandler(_uploadThumbnail);
export const uploadVideoDetails = asyncHandler(_uploadVideoDetails);
export const updateVideoDetails = asyncHandler(_updateVideoDetails);
export const updateVideoPrivacy = asyncHandler(_updateVideoPrivacy);
export const togglePublishStatus = asyncHandler(_togglePublishStatus);
export const getVideo = asyncHandler(_getVideo);
export const getRandomVideos = asyncHandler(_getRandomVideos);
export const getAllVideos = asyncHandler(_getAllVideos);
export const deleteVideo = asyncHandler(_deleteVideo);
export const increaseViews = asyncHandler(_increaseViews);
