import ct from "@/common/constants";
import mongoose, { AggregatePaginateModel, Document, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface ILike extends Document {
  video?: string | Schema.Types.ObjectId;
  comment?: string | Schema.Types.ObjectId;
  tweet?: string | Schema.Types.ObjectId;
  value: number;
  owner: string | Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILikeModel extends AggregatePaginateModel<ILike> {}

const likeSchema: Schema<ILike> = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
    value: {
      type: Number,
      enum: ct.likeValues,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.plugin(mongooseAggregatePaginate);

export const Like: ILikeModel = mongoose.model<ILike, ILikeModel>(
  "Like",
  likeSchema
);
