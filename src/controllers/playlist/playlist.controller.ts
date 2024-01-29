import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { createPlaylist } from "./handlers/create-playlist.handler";
import { deletePlaylist } from "./handlers/delete-playlist.handler";
import { getPlaylist } from "./handlers/get-playlist.handler";
import { searchPlaylist } from "./handlers/search-playlists.handler";
import { togglePlaylistPrivacy } from "./handlers/toggle-playlist-privacy.handler";
import { updatePlaylist } from "./handlers/update-playlist.handler";

export class PlaylistController {
  constructor() {}

  public createPlaylist = asyncHandler(createPlaylist);
  public updatePlaylist = asyncHandler(updatePlaylist);
  public deletePlaylist = asyncHandler(deletePlaylist);
  public getPlaylist = asyncHandler(getPlaylist);
  public searchPlaylist = asyncHandler(searchPlaylist);
  public togglePlaylistPrivacy = asyncHandler(togglePlaylistPrivacy);
}
