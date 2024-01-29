import {
  addLike,
  getLikeHistory,
  getLikesCount,
  removeLike,
} from "@/controllers/like/like.controller";
import { verifyAuthentication } from "@/middlewares/auth/auth.middleware";
import { validateIds } from "@/middlewares/validation/id-validation.middleware";
import { Router } from "express";

const router = Router();

router.route("/get-count").get(validateIds, getLikesCount);

// the routes below require authentication
router.use(verifyAuthentication);

router.route("/add").post(validateIds, addLike);

router.route("/remove").delete(validateIds, removeLike);

router.route("/get-history").get(getLikeHistory);

export default router;
