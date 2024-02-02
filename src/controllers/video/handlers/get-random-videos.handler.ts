import { appConstants } from "@/constants";
import { Video } from "@/models/video.model";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { shuffleArray } from "@/utils/array/shuffle-array.util";
import { Request, Response } from "express";

// get random videos with pagination
export const getRandomVideos = async (req: Request, res: Response) => {
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
  const videos = await Video.aggregatePaginate(
    Video.aggregate([
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
};
