import { Playlist } from "@/models/playlist.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const togglePlaylistPrivacy = async (req: Request, res: Response) => {
  // get playlistId from req.params
  const { playlistId } = req.params;

  // get privacy from req.query
  const { privacy } = req.query;

  // validate privacy
  if (!["public", "private"].includes(String(privacy))) {
    throw new ApiError(400, "Invalid privacy!");
  }

  // validate playlistId using middleware!
  // find playlist
  const playlist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user?._id,
    },
    { privacy: String(privacy) },
    { new: true }
  );

  // send response
  res.status(200).json(
    new SuccessResponse("Playlist privacy updated successfully", {
      playlist,
    })
  );
};
