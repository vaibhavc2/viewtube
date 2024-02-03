import { db } from "@/database/models";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const searchPlaylist = async (req: Request, res: Response) => {
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
};
