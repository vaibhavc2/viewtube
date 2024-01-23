import {
  createPlaylist,
  deletePlaylist,
  getPlaylist,
  searchPlaylist,
  updatePlaylist,
} from "@/controllers/playlist/playlist.controller";
import { Router } from "express";

const router = Router();

router.route("/create").post(createPlaylist);

router.route("/:playlistId/update").patch(updatePlaylist);

router.route("/:playlistId/delete").delete(deletePlaylist);

router.route("/get-playlist").get(getPlaylist);

router.route("/search-playlist").get(searchPlaylist);

export default router;
