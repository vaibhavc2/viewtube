import {
  createPlaylist,
  deletePlaylist,
  getPlaylist,
  searchPlaylist,
  togglePlaylistPrivacy,
  updatePlaylist,
} from "@/controllers/playlist/playlist.controller";
import { verifyAuthentication } from "@/middlewares/auth/auth.middleware";
import { Router } from "express";

const router = Router();

router.route("/search-playlist").get(searchPlaylist);

router.route("/create").post(verifyAuthentication, createPlaylist);

router.route("/:playlistId").get(getPlaylist);

// the routes below require authentication
router.use(verifyAuthentication);

router.route("/:playlistId/update").patch(updatePlaylist);

router.route("/:playlistId/toggle-privacy").patch(togglePlaylistPrivacy);

router.route("/:playlistId/delete").delete(deletePlaylist);

export default router;
