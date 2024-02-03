import { asyncHandler } from "@/utils/async-handler.util";
import { addComment } from "./handlers/add-comment.handler";
import { deleteComment } from "./handlers/delete-comment.handler";
import { getCommentHistory } from "./handlers/get-comment-history.handler";
import { getComments } from "./handlers/get-comments.handler";
import { updateComment } from "./handlers/update-comment.handler";

export class CommentController {
  constructor() {}

  public addComment = asyncHandler(addComment);
  public deleteComment = asyncHandler(deleteComment);
  public getCommentHistory = asyncHandler(getCommentHistory);
  public getComments = asyncHandler(getComments);
  public updateComment = asyncHandler(updateComment);
}
