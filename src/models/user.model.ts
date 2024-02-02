import { envConfig } from "@/config";
import { appConstants } from "@/constants";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  _id: string | Schema.Types.ObjectId;
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  cover: string;
  channelDescription: string;
  disabled: boolean;
  watchHistory: Array<{
    videoId: string | Schema.Types.ObjectId;
    watchedAt: Date;
  }>;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateRefreshToken(): Promise<string>;
  generateAccessToken(): Promise<string>;
}

const UserSchema: Schema<IUser> = new Schema(
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
      validate: {
        validator: (v: string) => appConstants.emailRegex.test(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
      index: true,
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
      enum: appConstants.userRoles,
      default: appConstants.defaultUserRole,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    watchHistory: [
      {
        videoId: {
          type: Schema.Types.ObjectId,
          ref: "Video",
        },
        watchedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>("save", async function (next) {
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

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
