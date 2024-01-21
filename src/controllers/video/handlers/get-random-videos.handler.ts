import { Video } from "@/models/video.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

// get random videos with pagination
export const _getRandomVideos = async (req: Request, res: Response) => {
  // Destructure the page and limit query parameters from the request
  const { page = 1, limit = 10 } = req.query;

  // Define the options for pagination
  const options = {
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
  };

  try {
    // Use the aggregate function to get a random set of videos
    // The first argument is a Mongoose aggregation that uses the $match and $sample operators to filter and get a random set of videos.
    // The second argument is the options object, which sets the pagination options.
    // The third argument is the callback function.
    // skip() is used to skip the videos that have already been retrieved.
    // exec() is used to execute the aggregation.
    const videos = await Video.aggregate([
      { $match: { isPublished: true, private: false } },
      { $sample: { size: options.limit } },
    ])
      .skip((options.page - 1) * options.limit)
      .exec();

    // Send a 200 OK response with the videos and a success message.
    res
      .status(200)
      .json(new SuccessResponse("Videos fetched successfully!", { videos }));
  } catch (error) {
    throw new ApiError(500);
  }
};
