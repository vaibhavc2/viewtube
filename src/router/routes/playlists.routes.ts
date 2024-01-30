import { PlaylistController } from "@/controllers/playlist/playlist.controller";
import { middlewares } from "@/middlewares";

import { Router } from "express";

class PlaylistRouter {
  public router: Router;
  public controller: PlaylistController;

  constructor() {
    this.router = Router();
    this.controller = new PlaylistController();
    this.routes();
  }

  public routes() {
    this.router.get("/search-playlist", this.controller.searchPlaylist);
    this.router.post(
      "/create",
      middlewares.auth.user, // require authentication
      this.controller.createPlaylist
    );
    this.router.get("/:playlistId", this.controller.getPlaylist);

    // the routes below require authentication
    this.router.use(middlewares.auth.user);

    this.router.patch("/:playlistId/update", this.controller.updatePlaylist);
    this.router.patch(
      "/:playlistId/toggle-privacy",
      this.controller.togglePlaylistPrivacy
    );
    this.router.delete("/:playlistId/delete", this.controller.deletePlaylist);
  }
}

export const playlistsRouter = new PlaylistRouter().router;
