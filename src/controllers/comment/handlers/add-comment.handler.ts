import { db } from "@/database/models";
import ApiError from "@/utils/api-error.util";
import { SuccessResponse } from "@/utils/api-response.util";
import { Request, Response } from "express";

export const addComment = async (req: Request, res: Response) => {
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
};
