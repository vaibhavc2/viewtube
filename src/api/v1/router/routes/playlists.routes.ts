import { PlaylistController } from "@/api/v1/controllers/playlist.controller";
import auth from "@/common/middlewares/auth.middleware";
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
    /**
     * @openapi
     * /playlists/search:
     *   get:
     *     tags:
     *       - Playlists
     *     summary: Search playlists
     *     description: Search playlists
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     *     parameters:
     *       - in: query
     *         name: query
     *         required: true
     *         type: string
     */
    this.router.get("/search", this.controller.searchPlaylist);

    /**
     * @openapi
     * /playlists/{playlistId}:
     *   get:
     *     tags:
     *       - Playlists
     *     summary: Get playlist
     *     description: Get playlist
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     *     parameters:
     *       - in: path
     *         name: playlistId
     *         required: true
     *         type: string
     */
    this.router.get("/:playlistId", this.controller.getPlaylist);

    // the routes below require authentication
    this.router.use(auth.user);

    /**
     * @openapi
     * /playlists/create:
     *   post:
     *     tags:
     *       - Playlists
     *     summary: Create playlist
     *     description: Create playlist
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     *     security:
     *       - Bearer: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               videos:
     *                 type: array
     *               privacy:
     *                 type: number
     */
    this.router.post("/create", this.controller.createPlaylist);

    /**
     * @openapi
     * /playlists/{playlistId}:
     *   patch:
     *     tags:
     *       - Playlists
     *     summary: Update playlist
     *     description: Update playlist
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     *     security:
     *       - Bearer: []
     *     parameters:
     *       - in: path
     *         name: playlistId
     *         required: true
     *         type: string
     *       - in: body
     *         name: name
     *         required: false
     *         type: string
     *       - in: body
     *         name: description
     *         required: false
     *         type: string
     *       - in: body
     *         name: videos
     *         required: false
     *         type: array
     */
    this.router.patch("/:playlistId", this.controller.updatePlaylist);

    /**
     * @openapi
     * /playlists/{playlistId}/privacy:
     *   patch:
     *     tags:
     *       - Playlists
     *     summary: Toggle playlist privacy
     *     description: Toggle playlist privacy
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     *     security:
     *       - Bearer: []
     *     parameters:
     *       - in: path
     *         name: playlistId
     *         required: true
     *         type: string
     *       - in: body
     *         name: privacy
     *         required: true
     *         type: number
     *         default: 0
     *         description: 0 - public, 1 - private
     */
    this.router.patch(
      "/:playlistId/privacy",
      this.controller.togglePlaylistPrivacy
    );

    /**
     * @openapi
     * /playlists/{playlistId}:
     *   delete:
     *     tags:
     *       - Playlists
     *     summary: Delete playlist
     *     description: Delete playlist
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     *     security:
     *       - Bearer: []
     *     parameters:
     *       - in: path
     *         name: playlistId
     *         required: true
     *         type: string
     */
    this.router.delete("/:playlistId", this.controller.deletePlaylist);
  }
}

export const playlistsRouter = new PlaylistRouter().router;
