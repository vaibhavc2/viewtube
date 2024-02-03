import { db } from "@/database/models";
import ApiError from "@/utils/api-error.util";
import { SuccessResponse } from "@/utils/api-response.util";
import { Request, Response } from "express";

export const updatePlaylist = async (req: Request, res: Response) => {
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
};
