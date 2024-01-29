import dotenv from "dotenv";
import env from "env-var";

class Config {
  constructor() {
    // config() will read your .env file, parse the contents, assign it to process.env,
    dotenv.config();

    // If you want to override from system env variables
    // you can do it here
    // dotenv.config({ path: "/custom/path/to/.env" });

    // initialize your config
    this.init();
  }

  private init() {
    // Validate your env variables
    this.validateEnv();
  }

  private validateEnv() {
    env.get("NODE_ENV").required().asEnum(["development", "production"]);
    env.get("PORT").default(8000).asPortNumber();
    env.get("MONGO_URI").required().asString();
    env.get("FRONTEND_URI").required().asString();
    env.get("DB_NAME").required().asString();
    env.get("SECRET_KEY").required().asString();
    env.get("ACCESS_TOKEN_SECRET").required().asString();
    env.get("ACCESS_TOKEN_EXPIRY").required().asString();
    env.get("REFRESH_TOKEN_SECRET").required().asString();
    env.get("REFRESH_TOKEN_EXPIRY").required().asString();
    env.get("CLOUDINARY_CLOUD_NAME").required().asString();
    env.get("CLOUDINARY_API_KEY").required().asString();
    env.get("CLOUDINARY_API_SECRET").required().asString();
  }

  // Getters
  get(key: string): string {
    return process.env[key] || "";
  }

  port(): number {
    return parseInt(this.get("PORT"));
  }

  nodeEnv(): string {
    return this.get("NODE_ENV");
  }

  isDev(): boolean {
    return process.env.NODE_ENV === "development";
  }

  isProd(): boolean {
    return process.env.NODE_ENV === "production";
  }

  mongoUri(): string {
    return this.get("MONGO_URI");
  }

  frontendUri(): string {
    return this.get("FRONTEND_URI");
  }

  dbName(): string {
    return this.get("DB_NAME");
  }

  secretKey(): string {
    return this.get("SECRET_KEY");
  }

  accessTokenSecret(): string {
    return this.get("ACCESS_TOKEN_SECRET");
  }

  accessTokenExpiry(): string {
    return this.get("ACCESS_TOKEN_EXPIRY");
  }

  refreshTokenSecret(): string {
    return this.get("REFRESH_TOKEN_SECRET");
  }

  refreshTokenExpiry(): string {
    return this.get("REFRESH_TOKEN_EXPIRY");
  }

  cloudinaryCloudName(): string {
    return this.get("CLOUDINARY_CLOUD_NAME");
  }

  cloudinaryApiKey(): string {
    return this.get("CLOUDINARY_API_KEY");
  }

  cloudinaryApiSecret(): string {
    return this.get("CLOUDINARY_API_SECRET");
  }
}

export const envConfig = new Config();
