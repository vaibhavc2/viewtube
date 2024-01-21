import {
  addLike,
  getLikesCount,
  removeLike,
} from "@/controllers/like/like.controller";
import { Router } from "express";

const router = Router();

router.route("/add").post(addLike);

router.route("/remove").delete(removeLike);

router.route("/get-count").get(getLikesCount);

export default router;
