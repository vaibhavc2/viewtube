import { __prefix_api_version } from "@/constants/express";

//? STATIC ROUTES
// ***************************************************

const unsecured_user_routes = ["/register", "/login", "/refresh"];

const unsecured_video_routes = ["/videos", "/random-videos"];

const unsecured_tweet_routes = ["/get-tweets"];

const unsecured_like_routes = ["/get-count"];

const unsecured_comment_routes = ["get-comments"];

//? DYNAMIC ROUTES
// ***************************************************

//! use full path for dynamic routes

const unsecured_video_dynamic_routes = [
  `${__prefix_api_version}/videos/:videoId`,
  `${__prefix_api_version}/videos/:videoId/increase-views`,
];

const unsecured_app_health_dynamic_routes = [`${__prefix_api_version}/:text`];

//? EXPORTS
// ***************************************************

export const __unsecured_routes = new Set(
  ...unsecured_user_routes,
  ...unsecured_video_routes,
  ...unsecured_tweet_routes,
  ...unsecured_like_routes,
  ...unsecured_comment_routes
);

export const __unsecured_dynamic_routes = new Set(
  ...unsecured_video_dynamic_routes,
  ...unsecured_app_health_dynamic_routes
);
