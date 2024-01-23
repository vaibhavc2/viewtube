import { asyncHandler } from "@/utils/server/handlers/async-handler.util";
import { _createPlaylist } from "./handlers/create-playlist.handler";
import { _deletePlaylist } from "./handlers/delete-playlist.handler";
import { _getPlaylist } from "./handlers/get-playlist.handler";
import { _searchPlaylist } from "./handlers/search-playlists.handler";
import { _updatePlaylist } from "./handlers/update-playlist.handler";

export const createPlaylist = asyncHandler(_createPlaylist);
export const updatePlaylist = asyncHandler(_updatePlaylist);
export const deletePlaylist = asyncHandler(_deletePlaylist);
export const getPlaylist = asyncHandler(_getPlaylist);
export const searchPlaylist = asyncHandler(_searchPlaylist);
