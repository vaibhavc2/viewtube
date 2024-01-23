import { testAppHealth } from "@/controllers/app-health/app-health.controller";
import { Router } from "express";

const router = Router();

router.route("/health").get(testAppHealth);

router.route("/health/:text").get(testAppHealth);

export default router;
