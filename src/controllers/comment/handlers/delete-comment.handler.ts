import { Comment } from "@/models/comment.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _deleteComment = async (req: Request, res: Response) => {
  // get id of comment
  const { commentId } = req.params;

  // verify commentId
  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found!");

  // delete comment
  await Comment.findOneAndDelete({
    _id: commentId,
    owner: req.user?._id,
  });

  // send response
  res.status(200).json(new SuccessResponse("Comment deleted successfully!"));
};
