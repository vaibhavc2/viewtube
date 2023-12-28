import { Router } from "express";
import {
  addSubscription,
  removeSubscription,
} from "../controllers/subscription/subscription.controller.js";

const router = Router();

router.route("/add/:channelUserName").post(addSubscription);

router.route("/remove/:channelUserName").delete(removeSubscription);

export default router;
