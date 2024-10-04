import { asyncHandler } from "@/common/utils/async-handler.util";
import { db } from "@/common/db.client";
import ApiError from "@/common/utils/api-error.util";
import { SuccessResponse } from "@/common/utils/api-response.util";
import { Request, Response } from "express";
import ct from "@/common/constants";
import mongoose from "mongoose";

export class CommentController {
  public addComment = asyncHandler(async (req: Request, res: Response) => {
    // get the content of the comment from the req.body
    const { content } = req.body;

    // check for content
    if (!content) {
      throw new ApiError(400, "Comment can't be empty!");
    }

    // validation is done using middleware!
    // get the videoId, commentId, tweetId from req.query
    const { videoId, commentId, tweetId } = req.query;

    // create the comment
    const comment = await db.Comment.create({
      content,
      ...(commentId && { comment: commentId }), // handling replies
      ...(videoId && { video: videoId }),
      ...(tweetId && { tweet: tweetId }),
      owner: req.user?._id,
    });

    // check if comment is created
    const createdComment = await db.Comment.findById(comment._id);

    // final verification
    if (!comment || !createdComment) {
      throw new ApiError(500, "Something went wrong!");
    }

    // send the response
    res.status(201).json(
      new SuccessResponse("Comment added successfully!", {
        comment: createdComment,
      })
    );
  });

  public deleteComment = asyncHandler(async (req: Request, res: Response) => {
    // get id of comment
    const { commentId } = req.params;

    // verify commentId
    const comment = await db.Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found!");

    // delete comment
    await db.Comment.findOneAndDelete({
      _id: commentId,
      owner: req.user?._id,
    });

    // send response
    res.status(200).json(new SuccessResponse("Comment deleted successfully!"));
  });

  public getCommentHistory = asyncHandler(
    async (req: Request, res: Response) => {
      const { pagination } = ct;
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
    }
  );

  public getComments = asyncHandler(async (req: Request, res: Response) => {
    const { pagination } = ct;
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
        (match as any)["owner"] = new mongoose.Types.ObjectId(
          user._id as string
        );
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
  });

  public updateComment = asyncHandler(async (req: Request, res: Response) => {
    // get id of comment
    const { commentId } = req.params;

    // get new content of comment
    const { content } = req.body;

    // validate content
    if (!content) {
      throw new ApiError(400, "Comment is required!");
    }

    // update comment
    const comment = await db.Comment.findOneAndUpdate(
      {
        _id: commentId,
        owner: req.user?._id,
      },
      {
        $set: { content },
      },
      {
        new: true,
      }
    );

    // send response
    res
      .status(200)
      .json(new SuccessResponse("Comment updated successfully!", { comment }));
  });
}
