import {
  getChannelStats,
  getChannelVideos,
} from "@/controllers/dashboard/dashboard.controller";
import { verifyAuthentication } from "@/middlewares/auth/auth.middleware";
import { Router } from "express";

const router = Router();

router.route("/:userId/channel-stats").get(getChannelStats);

// the routes below require authentication
router.use(verifyAuthentication);

router.route("/videos").get(getChannelVideos);

export default router;
