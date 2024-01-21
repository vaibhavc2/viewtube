import { testAppHealth } from "@/controllers/app-health/app-health.controller";
import { Router } from "express";

const router = Router();

router.route("/:text").get(testAppHealth);

export default router;
