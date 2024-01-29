import { Video } from "@/models/video.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { seedVideos } from "@/utils/db/seeding/seed.videos";
import { Request, Response } from "express";

export const seedFakeVideos = async (req: Request, res: Response) => {
  // get number of videos to seed
  const { count, userId } = req.params;

  // check if count is valid
  if (!count) throw new ApiError(400, "Count is required.");
  if (isNaN(+count)) throw new ApiError(400, "Count must be a number.");

  // generate videos
  const videos = await seedVideos(+count, userId);

  // save videos
  await Video.insertMany(videos);

  // return success response
  res
    .status(200)
    .json(new SuccessResponse("Videos seeded successfully!", { videos }));
};
