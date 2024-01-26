import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { _changeRole } from "./handlers/change-role.handler";
import { _seedFakeUsers } from "./handlers/seed-users.handler";

export const changeRole = asyncHandler(_changeRole);
export const seedFakeUsers = asyncHandler(_seedFakeUsers);
