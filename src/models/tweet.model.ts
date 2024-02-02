import mongoose, { AggregatePaginateModel, Document, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface ITweet extends Document {
  content: string;
  owner: string | Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITweetModel extends AggregatePaginateModel<ITweet> {}

const tweetSchema: Schema<ITweet> = new Schema(
  {
    content: {
      type: String,
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

tweetSchema.plugin(mongooseAggregatePaginate);

export const Tweet: ITweetModel = mongoose.model<ITweet, ITweetModel>(
  "Tweet",
  tweetSchema
);
