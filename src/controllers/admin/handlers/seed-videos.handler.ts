import { User } from "@/models/user.model";
import { Video } from "@/models/video.model";
import { generateFakeData } from "@/services/fake-data.service";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const seedFakeVideos = async (req: Request, res: Response) => {
  const { num = 50, drop = 0 } = req.query;

  // validate query params
  if (isNaN(+num)) {
    throw new ApiError(400, "Number of users must be a number.");
  }
  if (isNaN(+drop)) {
    throw new ApiError(400, "Drop must be a number. (representing boolean)");
  }

  if (+drop === 1) {
    await User.collection.drop();
  }

  // generate videos
  const videos = await generateFakeData.videos(+num, String(req.user?._id));

  // save videos
  const result = await Video.insertMany(videos);

  if (!result) {
    throw new ApiError(500, "Failed to seed videos.");
  }

  // return success response
  res
    .status(200)
    .json(new SuccessResponse("Videos seeded successfully!", { videos }));
};
