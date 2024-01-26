import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { _changeRole } from "./handlers/change-role.handler";
import { _deleteUser } from "./handlers/delete-user.handler";
import { _disableUser } from "./handlers/disable-user.handler";
import { _enableUser } from "./handlers/enable-user.handler";
import { _seedFakeUsers } from "./handlers/seed-users.handler";

export const changeRole = asyncHandler(_changeRole);
export const seedFakeUsers = asyncHandler(_seedFakeUsers);
export const deleteUser = asyncHandler(_deleteUser);
export const disableUser = asyncHandler(_disableUser);
export const enableUser = asyncHandler(_enableUser);
