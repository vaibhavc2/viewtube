import {
  createPlaylist,
  deletePlaylist,
  getPlaylist,
  searchPlaylist,
  togglePlaylistPrivacy,
  updatePlaylist,
} from "@/controllers/playlist/playlist.controller";
import { Router } from "express";

const router = Router();

router.route("/create").post(createPlaylist);

router.route("/search-playlist").get(searchPlaylist);

router.route("/:playlistId").get(getPlaylist);

router.route("/:playlistId/update").patch(updatePlaylist);

router.route("/:playlistId/toggle-privacy").patch(togglePlaylistPrivacy);

router.route("/:playlistId/delete").delete(deletePlaylist);

export default router;
