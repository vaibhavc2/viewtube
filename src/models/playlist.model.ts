import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPlaylist extends Document {
  name: string;
  description: string;
  private: boolean;
  videos: Array<string | Schema.Types.ObjectId>;
  owner: string | Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const playlistSchema: Schema<IPlaylist> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    private: {
      type: Boolean,
      default: false,
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Playlist: Model<IPlaylist> = mongoose.model<IPlaylist>(
  "Playlist",
  playlistSchema
);
