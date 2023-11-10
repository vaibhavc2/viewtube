import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { videoSchema } from "./schema/video.schema.js";

const VideoSchema: Schema = new Schema(videoSchema, {
  timestamps: true,
});

VideoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", VideoSchema);
