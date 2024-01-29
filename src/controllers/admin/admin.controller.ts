import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { changeRole } from "./handlers/change-role.handler";
import { deleteUser } from "./handlers/delete-user.handler";
import { disableUser } from "./handlers/disable-user.handler";
import { enableUser } from "./handlers/enable-user.handler";
import { seedFakeUsers } from "./handlers/seed-users.handler";
import { seedFakeVideos } from "./handlers/seed-videos.handler";

export class AdminController {
  constructor() {}

  public changeRole = asyncHandler(changeRole);
  public deleteUser = asyncHandler(deleteUser);
  public disableUser = asyncHandler(disableUser);
  public enableUser = asyncHandler(enableUser);
  public seedFakeUsers = asyncHandler(seedFakeUsers);
  public seedFakeVideos = asyncHandler(seedFakeVideos);
}
