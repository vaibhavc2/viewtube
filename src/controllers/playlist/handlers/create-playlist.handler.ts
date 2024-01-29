import { Playlist } from "@/models/playlist.model";
import ApiError from "@/utils/api/error/api-error.util";
import { CreatedResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const createPlaylist = async (req: Request, res: Response) => {
  // get details from request body
  const { name, description, videos, isPrivate = false } = req.body;

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

  // create playlist
  const playlist = await Playlist.create({
    name,
    description,
    videos,
    owner: req.user?._id,
    private: isPrivate,
  });

  // send response
  res.status(201).json(
    new CreatedResponse("Playlist created successfully!", {
      playlist,
    })
  );
};
