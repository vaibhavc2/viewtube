import { Schema } from "mongoose";

export const videoSchema = {
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
    default: true,
  },
  private: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
};
