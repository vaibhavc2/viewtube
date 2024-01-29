import { envConfig } from "@/config";
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
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    disabled: {
      type: Boolean,
      default: false,
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
    secret: Buffer.from(envConfig.secretKey()),
  });
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this;
  return await argon2.verify(user.password, candidatePassword, {
    secret: Buffer.from(envConfig.secretKey()),
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
    envConfig.refreshTokenSecret(),
    {
      expiresIn: envConfig.refreshTokenExpiry(),
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
    envConfig.accessTokenSecret(),
    {
      expiresIn: envConfig.accessTokenExpiry(),
    }
  );
  return accessToken;
};

export const User = mongoose.model("User", UserSchema);
