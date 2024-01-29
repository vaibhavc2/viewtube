import {
  addLike,
  getLikeHistory,
  getLikesCount,
  removeLike,
} from "@/controllers/like/like.controller";
import { validateIds } from "@/middlewares/validation/id-validation.middleware";
import { Router } from "express";

const router = Router();

router.route("/add").post(validateIds, addLike);

router.route("/remove").delete(validateIds, removeLike);

router.route("/get-count").get(validateIds, getLikesCount);

router.route("/get-history").get(getLikeHistory);

export default router;
