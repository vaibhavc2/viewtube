import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { deleteVideo } from "./handlers/delete-video.handler";
import { getAllVideos } from "./handlers/get-all-videos.handler";
import { getRandomVideos } from "./handlers/get-random-videos.handler";
import { getVideo } from "./handlers/get-video.handler";
import { increaseViews } from "./handlers/increase-views.handler";
import { togglePublishStatus } from "./handlers/toggle-publish-status";
import { updateThumbnail } from "./handlers/update-thumbnail.handler";
import { updateVideoDetails } from "./handlers/update-video-details.handler";
import { updateVideoPrivacy } from "./handlers/update-video-privacy.handler";
import { updateVideo } from "./handlers/update-video.handler";
import { uploadVideo } from "./handlers/upload-video.handler";

export class VideoController {
  constructor() {}

  public uploadVideo = asyncHandler(uploadVideo);
  public updateVideo = asyncHandler(updateVideo);
  public deleteVideo = asyncHandler(deleteVideo);
  public getVideo = asyncHandler(getVideo);
  public getAllVideos = asyncHandler(getAllVideos);
  public getRandomVideos = asyncHandler(getRandomVideos);
  public increaseViews = asyncHandler(increaseViews);
  public togglePublishStatus = asyncHandler(togglePublishStatus);
  public updateVideoDetails = asyncHandler(updateVideoDetails);
  public updateVideoPrivacy = asyncHandler(updateVideoPrivacy);
  public updateThumbnail = asyncHandler(updateThumbnail);
}
