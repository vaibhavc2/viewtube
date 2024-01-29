import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { changePassword } from "./handlers/change-password.handler";
import { disableUser } from "./handlers/disable-user.handler";
import { getChannelDescription } from "./handlers/get-channel-description.handler";
import { getChannelProfile } from "./handlers/get-channel-profile.handler";
import { getUser } from "./handlers/get-user.handler";
import { getWatchHistory } from "./handlers/get-watch-history.handler";
import { login } from "./handlers/login.handler";
import { logout } from "./handlers/logout.handler";
import { refresh } from "./handlers/refresh.handler";
import { register } from "./handlers/register.handler";
import { updateAvatar } from "./handlers/update-avatar.handler";
import { updateChannelDescription } from "./handlers/update-channel-description.handler";
import { updateCover } from "./handlers/update-cover.handler";
import { updateUser } from "./handlers/update-user.handler";
import { updateWatchHistory } from "./handlers/update-watch-history.handler";

export class UserController {
  constructor() {}

  public register = asyncHandler(register);
  public login = asyncHandler(login);
  public logout = asyncHandler(logout);
  public refresh = asyncHandler(refresh);
  public getUser = asyncHandler(getUser);
  public updateUser = asyncHandler(updateUser);
  public changePassword = asyncHandler(changePassword);
  public disableUser = asyncHandler(disableUser);
  public updateAvatar = asyncHandler(updateAvatar);
  public updateCover = asyncHandler(updateCover);
  public getChannelProfile = asyncHandler(getChannelProfile);
  public getChannelDescription = asyncHandler(getChannelDescription);
  public updateChannelDescription = asyncHandler(updateChannelDescription);
  public getWatchHistory = asyncHandler(getWatchHistory);
  public updateWatchHistory = asyncHandler(updateWatchHistory);
}
