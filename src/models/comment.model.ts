import mongoose, { AggregatePaginateModel, Document, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IComment extends Document {
  content: string;
  video?: string | Schema.Types.ObjectId;
  tweet?: string | Schema.Types.ObjectId;
  comment?: string | Schema.Types.ObjectId;
  owner: string | Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentModel extends AggregatePaginateModel<IComment> {}

const commentSchema: Schema<IComment> = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
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

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment: ICommentModel = mongoose.model<IComment, ICommentModel>(
  "Comment",
  commentSchema
);
