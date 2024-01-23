import {
  addComment,
  deleteComment,
  getComments,
  updateComment,
} from "@/controllers/comment/comment.controller";
import { validateIds } from "@/middlewares/validation/id-validation.middleware";
import { Router } from "express";

const router = Router();

router.route("/get-comments").get(validateIds, getComments);

router.route("/add-comment").post(validateIds, addComment);

router.route("/:commentId/delete").delete(deleteComment);

router.route("/:commentId/update").patch(updateComment);

export default router;
