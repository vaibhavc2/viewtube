import dotenv from "dotenv";
import * as e from "env-var";

dotenv.config();

const config = {
  PORT: e.get("PORT").default("3000").asIntPositive(),
  HOST: e.get("HOST").default("localhost").asString(),
  NODE_ENV: e.get("NODE_ENV").default("development").asString(),
  FRONTEND_URI: e.get("FRONTEND_URI").asString(), //! change in production to frontend url only!
  DB_NAME: e.get("DB_NAME").required().asString(),
  MONGO_URI: e.get("MONGO_URI").required().asString(),
  SECRET_KEY: e.get("SECRET_KEY").required().asString(),
  ACCESS_TOKEN_SECRET: e.get("ACCESS_TOKEN_SECRET").required().asString(),
  ACCESS_TOKEN_EXPIRY: e.get("ACCESS_TOKEN_EXPIRY").default("10m").asString(),
  REFRESH_TOKEN_SECRET: e.get("REFRESH_TOKEN_SECRET").required().asString(),
  REFRESH_TOKEN_EXPIRY: e.get("REFRESH_TOKEN_EXPIRY").default("7d").asString(),
  CLOUDINARY_CLOUD_NAME: e.get("CLOUDINARY_CLOUD_NAME").required().asString(),
  CLOUDINARY_API_KEY: e.get("CLOUDINARY_API_KEY").required().asString(),
  CLOUDINARY_API_SECRET: e.get("CLOUDINARY_API_SECRET").required().asString(),
};

const extraConfig = {
  isDev: config.NODE_ENV === "development",
  isProd: config.NODE_ENV === "production",
};

const env = { ...config, ...extraConfig };

export default env;
