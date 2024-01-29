import { Playlist } from "@/models/playlist.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _updatePlaylist = async (req: Request, res: Response) => {
  // get details from request body
  const { name, description, videos } = req.body;

  // get playlist id from request params
  const { playlistId } = req.params;

  // validation of name
  if (!name) {
    throw new ApiError(400, "Playlist Name is required!");
  }

  // description can be empty, no need of validation
  // no need of validation of videos array, we are allowing empty playlists to be created

  // check if playlist with same name already exists
  const existingPlaylist = await Playlist.findOne({
    name,
    owner: req.user?._id,
  });

  // if playlist with same name already exists, throw error
  if (existingPlaylist) {
    throw new ApiError(400, "Playlist with same name already exists!");
  }

  // update playlist
  const playlist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user?._id,
    },
    {
      name,
      description,
      videos,
    },
    { new: true }
  );

  // send response
  res.status(200).json(
    new SuccessResponse("Playlist updated successfully!", {
      playlist,
    })
  );
};
