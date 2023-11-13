import NodeCache from "node-cache";

export const cache = new NodeCache({
  stdTTL: 60 * 60 * 24 * 7, // 1 week
  checkperiod: 60 * 60, // 1 hour
});
