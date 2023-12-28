import { Request, Response } from "express";

// TODO: implement pagination in videos

export const _getVideos = async (req: Request, res: Response) => {
  // // get random 50 videos from database
  // const videos = await Video.aggregate([
  //   { $match: { privacy: false } },
  //   { $sample: { size: 50 } },
  // ]);
  // // get first 50 videos from database
  // const videos = await Video.find({ privacy: false }).limit(50);
  // // send response
  // return res.status(200).json(
  //   new SuccessResponse("Videos fetched successfully!", {
  //     videos,
  //   })
  // );
};
