import { db } from "@/database/models";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const deletePlaylist = async (req: Request, res: Response) => {
  // get playlist id from request params
  const { playlistId } = req.params;

  // find if playlist exists
  const playlist = await db.Playlist.findById(playlistId);

  // if playlist does not exists, throw error
  if (!playlist) {
    throw new ApiError(404, "Playlist not found!");
  }

  // check if user is owner of playlist
  if (String(playlist.owner) !== String(req.user?._id)) {
    throw new ApiError(403, "You are not authorized to delete this playlist!");
  }

  // delete playlist
  await db.Playlist.findByIdAndDelete(playlistId);

  // send response
  res.status(200).json(
    new SuccessResponse("Playlist deleted successfully!", {
      playlist,
    })
  );
};
