import mongoose, { AggregatePaginateModel, Document, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IVideo extends Document {
  videoUrl: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  publishDate: Date;
  private: boolean;
  videoCategories: string[];
  owner: string | Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVideoModel extends AggregatePaginateModel<IVideo> {}

const VideoSchema: Schema<IVideo> = new Schema(
  {
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishDate: {
      type: Date,
      required: false,
    },
    private: {
      type: Boolean,
      default: false,
    },
    videoCategories: [
      {
        type: String,
        required: true,
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

VideoSchema.plugin(mongooseAggregatePaginate);

export const Video: IVideoModel = mongoose.model<IVideo, IVideoModel>(
  "Video",
  VideoSchema
);
