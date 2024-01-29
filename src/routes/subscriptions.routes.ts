import {
  addSubscription,
  getTotalSubscribers,
  removeSubscription,
} from "@/controllers/subscription/subscription.controller";
import { verifyAuthentication } from "@/middlewares/auth/auth.middleware";
import { Router } from "express";

const router = Router();

router.route("/:userId/get-total-subscribers").get(getTotalSubscribers);

// the routes below require authentication
router.use(verifyAuthentication);

router.route("/add/:channelUserName").post(addSubscription);

router.route("/remove/:channelUserName").delete(removeSubscription);

export default router;
