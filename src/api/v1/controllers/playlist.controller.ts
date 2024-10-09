import { asyncHandler } from "@/common/utils/async-handler.util";
import { db } from "@/common/db.client";
import ApiError from "@/common/utils/api-error.util";
import { SuccessResponse } from "@/common/utils/api-response.util";
import { Request, Response } from "express";

export class PlaylistController {
  createPlaylist = asyncHandler(async (req: Request, res: Response) => {
    // get details from request body
    const { name, description, videos, privacy = 0 } = req.body;

    // validate that atleast one field is being updated
    if (!name && !videos) {
      throw new ApiError(
        400,
        "Both 'name' and 'videos' are required to create a playlist!"
      );
    }

    // create playlist
    const playlist = await db.Playlist.create({
      ...(name && { name }),
      ...(description && { description }),
      ...(videos && { videos }),
      ...(privacy && { private: Number(privacy) === 1 ? true : false }),
      owner: req.user?._id,
    });

    // send response
    res.status(200).json(
      new SuccessResponse("Playlist updated successfully!", {
        playlist,
      })
    );
  });

  updatePlaylist = asyncHandler(async (req: Request, res: Response) => {
    // get details from request body
    const { name, description, videos } = req.body;

    // get playlist id from request params
    const { playlistId } = req.params;

    // validate that atleast one field is being updated
    if (!name && !description && !videos) {
      throw new ApiError(400, "Atleast one field is required to update!");
    }

    // update playlist
    const playlist = await db.Playlist.findOneAndUpdate(
      {
        _id: playlistId,
        owner: req.user?._id,
      },
      {
        $set: {
          ...(name && { name }),
          ...(description && { description }),
          ...(videos && { videos }),
        },
      },
      { new: true }
    );

    // send response
    res.status(200).json(
      new SuccessResponse("Playlist updated successfully!", {
        playlist,
      })
    );
  });

  deletePlaylist = asyncHandler(async (req: Request, res: Response) => {
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
      throw new ApiError(
        403,
        "You are not authorized to delete this playlist!"
      );
    }

    // delete playlist
    await db.Playlist.findByIdAndDelete(playlistId);

    // send response
    res.status(200).json(
      new SuccessResponse("Playlist deleted successfully!", {
        playlist,
      })
    );
  });

  getPlaylist = asyncHandler(async (req: Request, res: Response) => {
    // get playlist id from request params
    const { playlistId } = req.params;

    // find playlist
    const playlist = await db.Playlist.findById(playlistId);

    // send response
    res.status(200).json(
      new SuccessResponse("Playlist fetched successfully!", {
        playlist,
      })
    );
  });

  searchPlaylist = asyncHandler(async (req: Request, res: Response) => {
    // get the search query from request query
    const { query } = req.query;

    // validation of query
    if (!query) {
      throw new ApiError(400, "Query is required!");
    }

    // find playlists
    const playlists = await db.Playlist.find({
      $or: [
        {
          name: {
            $regex: String(query),
            $options: "i",
          },
        },
        {
          description: {
            $regex: String(query),
            $options: "i",
          },
        },
      ],
    });

    // send response
    res.status(200).json(
      new SuccessResponse("Playlists fetched successfully!", {
        playlists,
      })
    );
  });

  togglePlaylistPrivacy = asyncHandler(async (req: Request, res: Response) => {
    // get playlistId from req.params
    const { playlistId } = req.params;

    // get privacy from req.query
    const { privacy: _privacy } = req.query;

    // validate privacy
    if (!["public", "private"].includes(String(_privacy))) {
      throw new ApiError(400, "Invalid privacy!");
    }

    const privacy = String(_privacy) === "private" ? true : false;

    // validate playlistId using middleware!
    // find playlist
    const playlist = await db.Playlist.findOneAndUpdate(
      {
        _id: playlistId,
        owner: req.user?._id,
      },
      {
        $set: {
          private: privacy,
        },
      },
      { new: true }
    );

    // send response
    res.status(200).json(
      new SuccessResponse("Playlist privacy updated successfully", {
        playlist,
      })
    );
  });
}
