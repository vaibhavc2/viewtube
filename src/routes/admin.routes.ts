import {
  changeRole,
  seedFakeUsers,
} from "@/controllers/admin/admin.controller";
import { Router } from "express";

const router = Router();

router.route("/db-seed/users").post(seedFakeUsers);

router.route("/change-role/user/:userId").patch(changeRole);

export default router;
