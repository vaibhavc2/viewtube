import { db } from "@/database/models";
import ApiError from "@/utils/api-error.util";
import { SuccessResponse } from "@/utils/api-response.util";
import { Request, Response } from "express";

export const updateComment = async (req: Request, res: Response) => {
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
};
