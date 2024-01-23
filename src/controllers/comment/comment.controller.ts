import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { _addComment } from "./handlers/add-comment.handler";
import { _deleteComment } from "./handlers/delete-comment.handler";
import { _getComments } from "./handlers/get-comments.handler";
import { _updateComment } from "./handlers/update-comment.handler";

export const getComments = asyncHandler(_getComments);
export const addComment = asyncHandler(_addComment);
export const deleteComment = asyncHandler(_deleteComment);
export const updateComment = asyncHandler(_updateComment);
