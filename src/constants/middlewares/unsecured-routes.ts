import { __prefix_api_version } from "@/constants/express";

//? STATIC ROUTES
// ***************************************************

const unsecured_user_routes = ["/register", "/login", "/refresh"];

const unsecured_video_routes = ["/all-videos", "/random-videos"];

const unsecured_subscription_routes = [""];

const unsecured_tweet_routes = ["/all-tweets"];

//? DYNAMIC ROUTES
// ***************************************************

//! use full path for dynamic routes

const unsecured_video_dynamic_routes = [
  `${__prefix_api_version}/videos/:videoId`,
  `${__prefix_api_version}/videos/:videoId/increase-views`,
  `${__prefix_api_version}/videos/:userId/videos`,
];

//? EXPORTS
// ***************************************************

export const __unsecured_routes = new Set(
  ...unsecured_user_routes,
  ...unsecured_video_routes,
  ...unsecured_subscription_routes,
  ...unsecured_tweet_routes
);

export const __unsecured_dynamic_routes = new Set(
  ...unsecured_video_dynamic_routes
);
