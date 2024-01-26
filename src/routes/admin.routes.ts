import {
  changeRole,
  deleteUser,
  disableUser,
  enableUser,
  seedFakeUsers,
} from "@/controllers/admin/admin.controller";
import { Router } from "express";

const router = Router();

router.route("/db-seed/users").post(seedFakeUsers);

router.route("/change-role/user/:userId").patch(changeRole);

router.route("/delete/user/:userId").delete(deleteUser);

router.route("/disable/user/:userId").patch(disableUser);

router.route("/enable/user/:userId").patch(enableUser);

export default router;
