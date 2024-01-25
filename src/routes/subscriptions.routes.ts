import {
  addSubscription,
  getTotalSubscribers,
  removeSubscription,
} from "@/controllers/subscription/subscription.controller";
import { Router } from "express";

const router = Router();

router.route("/add/:channelUserName").post(addSubscription);

router.route("/remove/:channelUserName").delete(removeSubscription);

router.route("/:userId/get-total-subscribers").get(getTotalSubscribers);

export default router;
