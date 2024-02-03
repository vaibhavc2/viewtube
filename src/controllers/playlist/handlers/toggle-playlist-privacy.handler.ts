import { db } from "@/database/models";
import ApiError from "@/utils/api-error.util";
import { SuccessResponse } from "@/utils/api-response.util";
import { Request, Response } from "express";

export const togglePlaylistPrivacy = async (req: Request, res: Response) => {
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
};
