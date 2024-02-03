import { appConstants } from "@/constants";
import { db } from "@/database/models";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const getCommentHistory = async (req: Request, res: Response) => {
  const { pagination } = appConstants;
  // get userId, page, limit, sortBy, sortType, query from req.query
  const {
    page = pagination.page,
    limit = pagination.pageLimit,
    query,
    sortBy = pagination.sortBy,
    sortType = pagination.sortType,
    comments,
    videos,
    tweets,
  } = req.query;

  // validate comments, videos, tweets: each of them must be either 0 or 1, and only one of them should be provided
  if (
    [comments, videos, tweets].filter((val) => val === "0" || val === "1")
      .length !== 1
  ) {
    throw new ApiError(
      400,
      "Only one of comments, videos, tweets should be provided and must be either 0 or 1!"
    );
  }

  // Define the options for pagination and sorting
  const options = {
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
    sort: {
      [sortBy as string]: sortType === "desc" ? -1 : 1,
    },
  };

  // Define the match object for the MongoDB query. This will be used to filter comments.
  // $options: "i" makes the query case-insensitive
  const match = {
    owner: new mongoose.Types.ObjectId(req.user?._id as string),
    ...(query && {
      content: { $regex: String(query) || "", $options: "i" },
    }),
    ...(comments === "1" && { comment: { $exists: true } }),
    ...(videos === "1" && { video: { $exists: true } }),
    ...(tweets === "1" && { tweet: { $exists: true } }),
  };

  // Use the aggregatePaginate function from the mongoose-aggregate-paginate-v2 plugin to retrieve the comments.
  const commentHistory = await db.Comment.aggregatePaginate(
    db.Comment.aggregate([{ $match: match }]),
    options
  );

  // send response
  res.status(200).json(
    new SuccessResponse("Comments fetched successfully!", {
      comments: commentHistory,
    })
  );
};
