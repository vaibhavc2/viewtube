import mongoose, { Schema } from "mongoose";
import { subscriptionSchema } from "./schema/subscription.schema.js";

const SubscriptionSchema = new Schema(subscriptionSchema, {
  timestamps: true,
});

export const Subscription = mongoose.model("Subscription", SubscriptionSchema);
