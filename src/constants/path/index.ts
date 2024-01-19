import path from "path";

const filename = process.cwd();
const dirname = path.dirname(path.dirname(filename));

// export const root = path.dirname(dirname);

// export const _public = path.join(root, "public");

export const __env = path.resolve(dirname, "../../.env");
