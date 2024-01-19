import dotenv from "dotenv";
import env from "env-var";

// dotenv.config({ path: __env });
dotenv.config();

export const NODE_ENV = env
  .get("NODE_ENV")
  .default("development")
  .asString()
  .match(/^(development|production)$/)?.[0];

if (!NODE_ENV) {
  throw new Error("NODE_ENV must be either 'development' or 'production'.");
}

export const PORT = env.get("PORT").default(8000).asPortNumber();

export const MONGO_URI = env.get("MONGO_URI").required().asString();

export const FRONTEND_URI = env.get("FRONTEND_URI").required().asString();

export const DB_NAME = env.get("DB_NAME").required().asString();

export const SECRET_KEY = env.get("SECRET_KEY").required().asString();

export const ACCESS_TOKEN_SECRET = env
  .get("ACCESS_TOKEN_SECRET")
  .required()
  .asString();

export const ACCESS_TOKEN_EXPIRY = env
  .get("ACCESS_TOKEN_EXPIRY")
  .required()
  .asString();

export const REFRESH_TOKEN_SECRET = env
  .get("REFRESH_TOKEN_SECRET")
  .required()
  .asString();

export const REFRESH_TOKEN_EXPIRY = env
  .get("REFRESH_TOKEN_EXPIRY")
  .required()
  .asString();

export const CLOUDINARY_CLOUD_NAME = env
  .get("CLOUDINARY_CLOUD_NAME")
  .required()
  .asString();

export const CLOUDINARY_API_KEY = env
  .get("CLOUDINARY_API_KEY")
  .required()
  .asString();

export const CLOUDINARY_API_SECRET = env
  .get("CLOUDINARY_API_SECRET")
  .required()
  .asString();
