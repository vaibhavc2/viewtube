import {
  addLike,
  getLikesCount,
  removeLike,
} from "@/controllers/like/like.controller";
import { validateIds } from "@/middlewares/validation/id-validation.middleware";
import { Router } from "express";

const router = Router();

router.route("/add").post(validateIds, addLike);

router.route("/remove").delete(removeLike);

router.route("/get-count").get(validateIds, getLikesCount);

export default router;
