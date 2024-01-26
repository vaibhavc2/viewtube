import {
  __page,
  __page_limit,
  __sort_by,
  __sort_type,
} from "@/constants/pagination";
import { User } from "@/models/user.model";
import { Video } from "@/models/video.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

// get all videos based on query, sort and pagination
export const _getAllVideos = async (req: Request, res: Response) => {
  // Destructure the query parameters from the request
  const {
    page = __page,
    limit = __page_limit,
    query,
    sortBy = __sort_by,
    sortType = __sort_type,
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
  const match = {
    title: { $regex: (query as string) || "", $options: "i" },
    isPublished: true,
    private: false,
  };

  // If a userId is provided in the query parameters, add it to the match object.
  // This will filter the videos to only return those owned by the specified user.
  if (userId) {
    const user = await User.findById(userId);
    if (user) (match as any)["owner"] = user._id;
    else throw new ApiError(404, "User not found! Wrong userId!");
  }

  // Use the aggregatePaginate function from the mongoose-aggregate-paginate-v2 plugin to retrieve the videos.
  // The first argument is a Mongoose aggregation that uses the match object to filter the videos.
  // The second argument is the options object, which sets the pagination and sorting options.
  const videos = await Video.aggregatePaginate(
    Video.aggregate([{ $match: match }]),
    options
  );

  // Send a 200 OK response with the videos and a success message.
  res.status(200).json(
    new SuccessResponse("Videos fetched successfully!", {
      videos,
    })
  );
};