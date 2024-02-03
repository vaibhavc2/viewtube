import { appConstants } from "@/constants";
import { db } from "@/database/models";
import ApiError from "@/utils/api-error.util";
import { SuccessResponse } from "@/utils/api-response.util";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const getComments = async (req: Request, res: Response) => {
  const { pagination } = appConstants;
  const {
    page: __page,
    pageLimit: __page_limit,
    sortBy: __sort_by,
    sortType: __sort_type,
  } = pagination;
  // get userId, page, limit, sortBy, sortType, query, commentId, videoId, tweetId, from req.query
  const {
    page = __page,
    limit = __page_limit,
    query,
    sortBy = __sort_by,
    sortType = __sort_type,
    userId,
    commentId,
    videoId,
    tweetId,
  } = req.query;

  // Define the options for pagination and sorting
  const options = {
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
    sort: {
      [sortBy as string]: sortType === "desc" ? -1 : 1,
    },
  };

  // validate the ids using middleware!

  // Define the match object for the MongoDB query. This will be used to filter comments.
  // $options: "i" makes the query case-insensitive
  const match = {
    ...(commentId && {
      comment: new mongoose.Types.ObjectId(String(commentId)),
    }),
    ...(videoId && { video: new mongoose.Types.ObjectId(String(videoId)) }),
    ...(tweetId && { tweet: new mongoose.Types.ObjectId(String(tweetId)) }),
    ...(query && {
      content: { $regex: String(query) || "", $options: "i" },
    }),
  };

  // If a userId is provided in the query parameters, add it to the match object.
  // This will filter comments to only return those owned by the specified user.
  if (userId) {
    const user = await db.User.findById(userId);
    if (user)
      (match as any)["owner"] = new mongoose.Types.ObjectId(user._id as string);
    else throw new ApiError(404, "User not found! Wrong userId!");
  }

  // Use the aggregatePaginate function from the mongoose-aggregate-paginate-v2 plugin to retrieve the comments.
  const comments = await db.Comment.aggregatePaginate(
    db.Comment.aggregate([{ $match: match }]),
    options
  );

  // send response
  res.status(200).json(
    new SuccessResponse("Comments fetched successfully!", {
      comments,
    })
  );
};
