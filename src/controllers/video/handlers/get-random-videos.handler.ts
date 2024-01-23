import { Video } from "@/models/video.model";
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

  // Send a 200 OK response with the videos and a success message.
  res
    .status(200)
    .json(new SuccessResponse("Videos fetched successfully!", { videos }));
};
