import dotenv from "dotenv";
import env from "env-var";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

export const NODE_ENV = env
  .get("NODE_ENV")
  .required()
  .asString()
  .match(/^(development|production)$/)?.[0];

if (!NODE_ENV) {
  throw new Error("NODE_ENV must be either 'development' or 'production'.");
}

export const PORT = env.get("PORT").default(5000).asPortNumber();

export const MONGO_URI = env.get("MONGO_URI").required().asString();

export const FRONTEND_URI = env.get("FRONTEND_URI").required().asString();
