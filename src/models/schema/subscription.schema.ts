import { Schema } from "mongoose";

export const subscriptionSchema = {
  subscriber: {
    type: Schema.Types.ObjectId, // one who is subscribing
    ref: "User",
  },
  channel: {
    type: Schema.Types.ObjectId, // one who is being subscribed to
    ref: "User",
  },
};
