import path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

export const __root = path.dirname(__dirname);

export const __public = path.join(__root, "public");

export const __env = path.resolve(__dirname, "../../.env");
