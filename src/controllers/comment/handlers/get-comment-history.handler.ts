import {
  __page,
  __page_limit,
  __sort_by,
  __sort_type,
} from "@/constants/pagination";
import { Comment } from "@/models/comment.model";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const _getCommentHistory = async (req: Request, res: Response) => {
  // get userId, page, limit, sortBy, sortType, query, commentId, videoId, tweetId, from req.query
  const {
    page = __page,
    limit = __page_limit,
    query,
    sortBy = __sort_by,
    sortType = __sort_type,
  } = req.query;

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
    owner: new mongoose.Types.ObjectId(req.user?._id),
    ...(query && {
      content: { $regex: String(query) || "", $options: "i" },
    }),
  };

  // Use the aggregatePaginate function from the mongoose-aggregate-paginate-v2 plugin to retrieve the comments.
  const comments = await Comment.aggregatePaginate(
    Comment.aggregate([{ $match: match }]),
    options
  );

  // send response
  res.status(200).json(
    new SuccessResponse("Comments fetched successfully!", {
      comments,
    })
  );
};
