import { Playlist } from "@/models/playlist.model";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _getPlaylist = async (req: Request, res: Response) => {
  // get playlist id from request params
  const { playlistId } = req.params;

  // find playlist
  const playlist = await Playlist.findById(playlistId);

  // send response
  res.status(200).json(
    new SuccessResponse("Playlist fetched successfully!", {
      playlist,
    })
  );
};
