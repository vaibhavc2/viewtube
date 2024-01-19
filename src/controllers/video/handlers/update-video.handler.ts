import { __video_valid_mime_types } from "@/constants/middlewares/mime-types";
import { Video } from "@/models/video.model";
import { cloudinaryService } from "@/services/cloudinary.service";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { getVideoLength } from "@/utils/video/get-video-length.util";
import { Request, Response } from "express";

export const _uploadVideo = async (req: Request, res: Response) => {
  // get video local path
  const videoLocalPath = req.file?.path;

  // check if video file is missing
  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is missing!");
  }

  // check if video is a valid video file
  if (!__video_valid_mime_types.includes(req.file?.mimetype as string)) {
    throw new ApiError(400, "Invalid Video File!");
  }

  // get the duration of the video: videoLength
  const videoLength = await getVideoLength(videoLocalPath);

  // check if video length is available
  if (!videoLength) {
    throw new ApiError(400, "Could not extract the length of the video!");
  }

  // upload video to cloudinary
  const video = await cloudinaryService.uploadFileToCloudinary(videoLocalPath);

  // check if video upload failed
  if (!video?.secure_url) {
    throw new ApiError(400, "Video upload failed!");
  }

  // get videoId from req.params
  const videoId = req.params.videoId;

  // save video url to database
  const savedVideo = await Video.findOneAndUpdate(
    {
      id: videoId,
      owner: req.user?._id,
    },
    {
      $set: {
        videoUrl: video.secure_url,
        duration: videoLength,
      },
    },
    { new: true }
  );

  // send response
  return res.status(200).json(
    new SuccessResponse("Video uploaded successfully!", {
      video: savedVideo,
    })
  );
};
