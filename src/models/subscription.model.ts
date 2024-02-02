import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISubscription extends Document {
  subscriber: string | Schema.Types.ObjectId;
  channel: string | Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema<ISubscription> = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, // one who is subscribing
      ref: "User",
      required: true,
    },
    channel: {
      type: Schema.Types.ObjectId, // one who is being subscribed to
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription: Model<ISubscription> = mongoose.model<ISubscription>(
  "Subscription",
  SubscriptionSchema
);
