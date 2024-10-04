import { asyncHandler } from "@/common/utils/async-handler.util";
import { appConstants } from "@/common/constants";
import { db } from "@/common/db.client";
import { cloudinaryService } from "@/common/services/cloudinary.service";
import ApiError from "@/common/utils/api-error.util";
import {
  CreatedResponse,
  SuccessResponse,
} from "@/common/utils/api-response.util";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { shuffleArray } from "@/common/utils/shuffle-array.util";

export class VideoController {
  public uploadVideo = asyncHandler(async (req: Request, res: Response) => {
    // get video details from request body
    const {
      title,
      description,
      videoUrl,
      duration,
      imageUrl: thumbnail,
      videoCategories,
    } = req.body as {
      title: string;
      description: string;
      videoUrl: string;
      duration: number;
      imageUrl: string;
      videoCategories: string[];
    };

    // validate videoUrl and thumbnail
    if (!videoUrl || !thumbnail) {
      throw new ApiError(400, "Video and thumbnail are required!");
    }

    // validate video categories
    if (!videoCategories || videoCategories.length === 0) {
      throw new ApiError(400, "Video categories are required!");
    }
    if (videoCategories.length > 5) {
      // max 5 categories
      throw new ApiError(400, "Maximum of 5 categories are allowed!");
    }
    if (
      // some: returns true if at least one element in the array satisfies the provided testing function
      appConstants.videoCategories.some(
        (category) => !videoCategories.includes(category)
      )
    ) {
      throw new ApiError(400, "Invalid video category!");
    }

    // create video
    const video = await db.Video.create({
      owner: req.user?._id,
      title,
      description,
      videoUrl,
      duration,
      thumbnail,
      videoCategories,
    });

    // verify if created
    const createdVideo = await db.Video.findById(video._id);

    // final verification
    if (!video || !createdVideo) {
      await cloudinaryService.deleteFileFromCloudinary(videoUrl);
      await cloudinaryService.deleteFileFromCloudinary(thumbnail);
      throw new ApiError(500, "Something went wrong!");
    }

    // send response
    return res.status(201).json(
      new CreatedResponse("Video uploaded successfully!", {
        video: createdVideo,
      })
    );
  });

  public updateVideo = asyncHandler(async (req: Request, res: Response) => {
    // get videoUrl and duration from req.body
    const { videoUrl, duration } = req.body as {
      videoUrl: string;
      duration: number;
    };

    // get videoId from req.params
    const videoId = req.params.videoId;

    // save video url to database
    const savedVideo = await db.Video.findOneAndUpdate(
      {
        _id: videoId,
        owner: req.user?._id,
      },
      {
        $set: {
          videoUrl,
          duration,
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
  });

  public deleteVideo = asyncHandler(async (req: Request, res: Response) => {
    // get videoId from request params
    const { videoId } = req.params;

    // get video from database
    const video = await db.Video.findOne({
      _id: videoId,
      owner: req.user?._id,
    });

    // check if video exists
    if (!video) {
      throw new ApiError(404, "Video not found!");
    }

    // delete video from cloudinary
    await cloudinaryService.deleteFileFromCloudinary(video.videoUrl);

    // delete thumbnail from cloudinary
    await cloudinaryService.deleteFileFromCloudinary(video.thumbnail);

    // delete video from database
    await db.Video.findOneAndDelete({
      _id: videoId,
      owner: req.user?._id,
    });

    // send response
    return res
      .status(200)
      .json(new SuccessResponse("Video deleted successfully!"));
  });

  public getVideo = asyncHandler(async (req: Request, res: Response) => {
    // get videoId from request params
    const { videoId } = req.params;

    // get video from database
    const video = await db.Video.findById(videoId);

    // send response
    return res.status(200).json(
      new SuccessResponse("Video fetched successfully!", {
        video,
      })
    );
  });

  public getAllVideos = asyncHandler(async (req: Request, res: Response) => {
    // Destructure the query parameters from the request
    const {
      page = appConstants.pagination.page,
      limit = appConstants.pagination.pageLimit,
      query,
      sortBy = appConstants.pagination.sortBy,
      sortType = appConstants.pagination.sortType,
      userId,
    } = req.query;

    // Define the options for pagination and sorting
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort: {
        [sortBy as string]: sortType === "desc" ? -1 : 1,
      },
    };

    // Define the match object for the MongoDB query. This will be used to filter the videos.
    let match: any = {
      isPublished: true,
      private: false,
    };

    if (query) {
      match = {
        ...match,
        $or: [
          { title: { $regex: String(query), $options: "i" } },
          { description: { $regex: String(query), $options: "i" } },
        ],
      };
    }

    // If a userId is provided in the query parameters, add it to the match object.
    // This will filter the videos to only return those owned by the specified user.
    if (userId) {
      const user = await db.User.findById(userId);
      if (user)
        (match as any)["owner"] = new mongoose.Types.ObjectId(
          user._id as string
        );
      else throw new ApiError(404, "User not found! Wrong userId!");
    }

    // Use the aggregatePaginate function from the mongoose-aggregate-paginate-v2 plugin to retrieve the videos.
    // The first argument is a Mongoose aggregation that uses the match object to filter the videos.
    // The second argument is the options object, which sets the pagination and sorting options.
    const videos = await db.Video.aggregatePaginate(
      db.Video.aggregate([{ $match: match }]),
      options
    );

    // Send a 200 OK response with the videos and a success message.
    res.status(200).json(
      new SuccessResponse("Videos fetched successfully!", {
        videos,
      })
    );
  });

  public getRandomVideos = asyncHandler(async (req: Request, res: Response) => {
    const { pagination } = appConstants;
    const { page: _page, pageLimit } = pagination;
    // Destructure the page and limit query parameters from the request
    const { page = _page, limit = pageLimit } = req.query;

    // Define the options for pagination
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort: {
        createdAt: -1,
      },
    };

    // Use the aggregatePaginate function (plugin) to get a random set of videos that match the given match object.
    const videos = await db.Video.aggregatePaginate(
      db.Video.aggregate([
        {
          $match: {
            isPublished: true,
            private: false,
          },
        },
      ]),
      options
    );

    // Shuffle the videos array
    videos.docs = shuffleArray(videos.docs);

    // Send a 200 OK response with the videos and a success message.
    res
      .status(200)
      .json(new SuccessResponse("Videos fetched successfully!", { videos }));
  });

  public increaseViews = asyncHandler(async (req: Request, res: Response) => {
    // get videoId from req.params
    const videoId = req.params.videoId;

    // get video from database
    const video = await db.Video.findOne({ _id: videoId });

    // check if video exists
    if (!video) {
      throw new ApiError(404, "Video not found!");
    }

    // increase views
    video.views += 1;

    // save video
    const result = await video.save({ validateBeforeSave: false });

    // check if video was saved successfully
    if (!result) {
      throw new ApiError(500, "Unable to increase video views!");
    }

    // send response
    return res.status(200).json(
      new SuccessResponse("Video views increased successfully!", {
        video,
      })
    );
  });

  public togglePublishStatus = asyncHandler(
    async (req: Request, res: Response) => {
      // get videoId from req.params
      const videoId = req.params.videoId;

      // get video from database
      const video = await db.Video.findOne({
        _id: videoId,
        owner: req.user?._id,
      });

      // check if video exists
      if (!video) {
        throw new ApiError(404, "Video not found!");
      }

      // toggle publish status
      video.isPublished = !video.isPublished;

      // save video
      const result = await video.save({ validateBeforeSave: false });

      // check if video was saved successfully
      if (!result) {
        throw new ApiError(500, "Unable to toggle video publish status!");
      }

      // send response
      return res.status(200).json(
        new SuccessResponse("Video publish status toggled successfully!", {
          video,
        })
      );
    }
  );

  public updateVideoDetails = asyncHandler(
    async (req: Request, res: Response) => {
      // get video details from request body
      const { title, description } = req.body as {
        title: string;
        description: string;
      };

      // get videoId from request params
      const { videoId } = req.params;

      // validate details here also
      if (!title && !description) {
        throw new ApiError(
          400,
          "Atleast one of Title and Description are required!"
        );
      }

      // validate title
      if (title && title.length < 3) {
        throw new ApiError(400, "Title must be at least 3 characters.");
      }

      // validate description
      if (description && description.length < 3) {
        throw new ApiError(400, "Description must be at least 3 characters.");
      }

      // check if any of the details are valid
      let validDetails = [];
      if (title) validDetails.push(title);
      if (description) validDetails.push(description);

      // save video details to database
      const video = await db.Video.findOneAndUpdate(
        {
          _id: videoId,
          owner: req.user?._id,
        },
        {
          $set: { ...validDetails },
        },
        { new: true }
      );

      // send response
      return res.status(200).json(
        new SuccessResponse("Video details uploaded successfully!", {
          video,
        })
      );
    }
  );

  public updateVideoPrivacy = asyncHandler(
    async (req: Request, res: Response) => {
      // get video privacy from request body
      const { privacy } = req.body as { privacy: boolean };

      // get videoId from request params
      const { videoId } = req.params;

      // validate privacy
      if (privacy === undefined) {
        throw new ApiError(400, "Privacy is required!");
      }

      // save video privacy to database
      const video = await db.Video.findOneAndUpdate(
        {
          _id: videoId,
          owner: req.user?._id,
        },
        {
          $set: {
            privacy,
          },
        },
        { new: true }
      );

      // send response
      return res.status(200).json(
        new SuccessResponse("Video privacy updated successfully!", {
          video,
        })
      );
    }
  );

  public updateThumbnail = asyncHandler(async (req: Request, res: Response) => {
    // get thumbnail from request body
    const { imageUrl: thumbnail } = req.body as { imageUrl: string };

    // get videoId from request params
    const videoId = req.params.videoId;

    // save thumbnail url to database
    const video = await db.Video.findOneAndUpdate(
      {
        _id: videoId,
        owner: req.user?._id,
      },
      {
        $set: {
          thumbnail,
        },
      },
      { new: true }
    );

    // send response
    return res.status(200).json(
      new SuccessResponse("Thumbnail uploaded successfully!", {
        video,
      })
    );
  });

  public updateVideoCategories = asyncHandler(
    async (req: Request, res: Response) => {
      // get video categories from request body
      const { videoCategories } = req.body as { videoCategories: string[] };

      // get videoId from request params
      const { videoId } = req.params;

      // validate video categories
      if (!videoCategories || videoCategories.length === 0) {
        throw new ApiError(400, "Video categories are required!");
      }
      if (videoCategories.length > 5) {
        // max 5 categories
        throw new ApiError(400, "Maximum of 5 categories are allowed!");
      }
      if (
        // some: returns true if at least one element in the array satisfies the provided testing function
        appConstants.videoCategories.some(
          (category) => !videoCategories.includes(category)
        )
      ) {
        throw new ApiError(400, "Invalid video category!");
      }

      // save video categories to database
      const video = await db.Video.findOneAndUpdate(
        {
          _id: videoId,
          owner: req.user?._id,
        },
        {
          $set: { videoCategories },
        },
        { new: true }
      );

      // send response
      return res.status(200).json(
        new SuccessResponse("Video categories updated successfully!", {
          video,
        })
      );
    }
  );
}
