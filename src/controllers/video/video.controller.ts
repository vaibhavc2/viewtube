import { asyncHandler } from "../../utils/server/handlers/async-handler.util.js";
import { _deleteVideo } from "./handlers/delete-video.handler.js";
import { _getVideo } from "./handlers/get-video.handler.js";
import { _getVideos } from "./handlers/get-videos.handler.js";
import { _updateVideoDetails } from "./handlers/update-video-details.handler.js";
import { _updateVideoPrivacy } from "./handlers/update-video-privacy.handler.js";
import { _uploadThumbnail } from "./handlers/upload-thumbnail.handler.js";
import { _uploadVideoDetails } from "./handlers/upload-video-details.handler.js";
import { _uploadVideo } from "./handlers/upload-video.handler.js";

export const uploadVideo = asyncHandler(_uploadVideo);
export const uploadThumbnail = asyncHandler(_uploadThumbnail);
export const uploadVideoDetails = asyncHandler(_uploadVideoDetails);
export const updateVideoDetails = asyncHandler(_updateVideoDetails);
export const updateVideoPrivacy = asyncHandler(_updateVideoPrivacy);
export const getVideo = asyncHandler(_getVideo);
export const getVideos = asyncHandler(_getVideos);
export const deleteVideo = asyncHandler(_deleteVideo);
