import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

export const __root = path.dirname(__dirname);

export const __public = path.join(__root, "public");

export const __env = path.resolve(__dirname, "../../.env");
