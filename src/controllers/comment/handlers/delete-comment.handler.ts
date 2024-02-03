import { db } from "@/database/models";
import ApiError from "@/utils/api-error.util";
import { SuccessResponse } from "@/utils/api-response.util";
import { Request, Response } from "express";

export const deleteComment = async (req: Request, res: Response) => {
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
};
