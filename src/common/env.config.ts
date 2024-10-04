import dotenv from "dotenv";
import * as env from "env-var";

dotenv.config();

const config = {
  PORT: env.get("PORT").default("3000").asIntPositive(),
  HOST: env.get("HOST").default("localhost").asString(),
  NODE_ENV: env.get("NODE_ENV").default("development").asString(),
  FRONTEND_URI: env.get("FRONTEND_URI").asString(), //! change in production to frontend url only!
  DB_NAME: env.get("DB_NAME").required().asString(),
  MONGO_URI: env.get("MONGO_URI").required().asString(),
  SECRET_KEY: env.get("SECRET_KEY").required().asString(),
  ACCESS_TOKEN_SECRET: env.get("ACCESS_TOKEN_SECRET").required().asString(),
  ACCESS_TOKEN_EXPIRY: env.get("ACCESS_TOKEN_EXPIRY").default("10m").asString(),
  REFRESH_TOKEN_SECRET: env.get("REFRESH_TOKEN_SECRET").required().asString(),
  REFRESH_TOKEN_EXPIRY: env
    .get("REFRESH_TOKEN_EXPIRY")
    .default("7d")
    .asString(),
  CLOUDINARY_CLOUD_NAME: env.get("CLOUDINARY_CLOUD_NAME").required().asString(),
  CLOUDINARY_API_KEY: env.get("CLOUDINARY_API_KEY").required().asString(),
  CLOUDINARY_API_SECRET: env.get("CLOUDINARY_API_SECRET").required().asString(),
};

const extraConfig = {
  isDev: config.NODE_ENV === "development",
  isProd: config.NODE_ENV === "production",
};

const envConfig = { ...config, ...extraConfig };
export default envConfig;
