import {
  __page,
  __page_limit,
  __sort_by,
  __sort_type,
} from "@/constants/pagination";
import { Video } from "@/models/video.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const _getChannelVideos = async (req: Request, res: Response) => {
  // Destructure the query parameters from the request
  const {
    page = __page,
    limit = __page_limit,
    isPublished, // isPublished is optional, send 1 for true, 0 for false
    isPrivate, // isPrivate is optional, send 1 for true, 0 for false
    sortBy = __sort_by,
    sortType = __sort_type,
  } = req.query;

  // validate
  if (![1, 0].includes(Number(isPublished))) {
    throw new ApiError(400, "Invalid value for isPublished!");
  }

  if (![1, 0].includes(Number(isPrivate))) {
    throw new ApiError(400, "Invalid value for isPrivate!");
  }

  // Define the options for pagination and sorting
  const options = {
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
    sort: {
      [sortBy as string]: sortType === "desc" ? -1 : 1,
    },
  };

  // Use the aggregatePaginate function from the mongoose-aggregate-paginate-v2 plugin to retrieve the videos.
  // The first argument is a Mongoose aggregation that uses the match object to filter the videos.
  // The second argument is the options object, which sets the pagination and sorting options.
  const videos = await Video.aggregatePaginate(
    Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(req.user?._id),
          ...(isPublished && { isPublished: Boolean(Number(isPublished)) }),
          ...(isPrivate && { private: Boolean(Number(isPrivate)) }),
        },
      },
    ]),
    options
  );

  // Send a 200 OK response with the videos and a success message.
  res.status(200).json(
    new SuccessResponse("Videos fetched successfully!", {
      videos,
    })
  );
};
