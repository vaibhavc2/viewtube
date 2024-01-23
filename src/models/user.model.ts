import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  SECRET_KEY,
} from "@/config/config";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: false,
    },
    channelDescription: {
      type: String,
      required: false,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

// UserSchema.index({ username: "text", fullName: "text" });

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  user.password = await argon2.hash(user.password, {
    secret: Buffer.from(SECRET_KEY),
  });
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this;
  return await argon2.verify(user.password, candidatePassword, {
    secret: Buffer.from(SECRET_KEY),
  });
};

UserSchema.methods.generateRefreshToken = async function () {
  const user = this;
  const refreshToken = jwt.sign(
    {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    }
  );
  return refreshToken;
};

UserSchema.methods.generateAccessToken = async function () {
  const user = this;
  const accessToken = jwt.sign(
    {
      _id: user._id,
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    }
  );
  return accessToken;
};

export const User = mongoose.model("User", UserSchema);
