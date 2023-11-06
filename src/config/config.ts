import dotenv from "dotenv";
import env from "env-var";
import { __env } from "../constants/path/index.js";

dotenv.config({ path: __env });
// console.log(__env);

export const NODE_ENV = env
  .get("NODE_ENV")
  .default("production")
  .asString()
  .match(/^(development|production)$/)?.[0];

if (!NODE_ENV) {
  throw new Error("NODE_ENV must be either 'development' or 'production'.");
}

export const PORT = env.get("PORT").default(8000).asPortNumber();

export const MONGO_URI = env.get("MONGO_URI").required().asString();

export const FRONTEND_URI = env.get("FRONTEND_URI").required().asString();

export const DB_NAME = env.get("DB_NAME").required().asString();
