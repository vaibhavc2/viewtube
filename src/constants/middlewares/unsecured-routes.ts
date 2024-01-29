import { __prefix_api_version } from "@/constants/express";

//? STATIC ROUTES
// ***************************************************

const unsecured_user_routes = ["/register", "/login", "/refresh"];

const unsecured_video_routes = ["/all-videos", "/random-videos"];

const unsecured_tweet_routes = ["/get-tweets"];

const unsecured_like_routes = ["/get-count"];

const unsecured_comment_routes = ["/get-comments"];

const unsecured_playlist_routes = ["/search-playlist"];

const unsecured_app_health_routes = ["/health"];

//? DYNAMIC ROUTES
// ***************************************************

//! use full path for dynamic routes

const unsecured_video_dynamic_routes = [
  `${__prefix_api_version}/videos/:videoId`,
  `${__prefix_api_version}/videos/:videoId/increase-views`,
];

const unsecured_subscription_dynamic_routes = [
  `${__prefix_api_version}/subscriptions/:userId/get-total-subscribers`,
];

const unsecured_app_health_dynamic_routes = [
  `${__prefix_api_version}/health/:text`,
];

const unsecured_playlist_dynamic_routes = [
  `${__prefix_api_version}/playlists/:playlistId`,
];

const unsecured_dashboard_dynamic_routes = [
  `${__prefix_api_version}/dashboard/:userId/channel-stats`,
];

//? EXPORTS
// ***************************************************

export const __unsecured_routes = [
  ...unsecured_user_routes,
  ...unsecured_video_routes,
  ...unsecured_tweet_routes,
  ...unsecured_like_routes,
  ...unsecured_comment_routes,
  ...unsecured_playlist_routes,
  ...unsecured_app_health_routes,
];

export const __unsecured_dynamic_routes = [
  ...unsecured_video_dynamic_routes,
  ...unsecured_app_health_dynamic_routes,
  ...unsecured_subscription_dynamic_routes,
  ...unsecured_playlist_dynamic_routes,
  ...unsecured_dashboard_dynamic_routes,
];
