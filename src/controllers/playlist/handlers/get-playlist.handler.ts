import { Playlist } from "@/models/playlist.model";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _getPlaylist = async (req: Request, res: Response) => {
  // get playlist id from request query
  const { playlistId } = req.query;

  // find playlist
  const playlist = await Playlist.findById(playlistId);

  // send response
  res.status(200).json(
    new SuccessResponse("Playlist fetched successfully!", {
      playlist,
    })
  );
};
