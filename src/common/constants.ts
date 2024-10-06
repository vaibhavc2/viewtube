import { Request, Response } from "express";
import env from "./env.config";
import { CorsOptions } from "cors";

const corsMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"];

class Constants {
  public readonly expressLimit = "50mb" as const;
  public readonly prefixApiVersion = "/api/v1" as const;
  public readonly webSocketRoutePath = "/ws" as const;
  public readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  public readonly userRoles = ["user", "admin"] as const;
  public readonly defaultUserRole = "user" as const;
  public readonly likeValues = [-1, 1] as const; // 1: like, -1: dislike
  public readonly defaultLikeValue = 1 as const;
  public readonly minVideoLength = 10 as const; // 10 seconds
  public readonly maxVideoSize = 1000 * 1024 * 1024 * 1024; // 1000 GB
  public readonly minPasswordLength = 6 as const;
  public readonly maxPasswordLength = 255 as const;
  public readonly minUsernameLength = 3 as const;
  public readonly maxUsernameLength = 20 as const;
  public readonly minFullNameLength = 3 as const;
  public readonly maxFullNameLength = 30 as const;
  public readonly maxEmailLength = 255 as const;
  public readonly maxVideoTitleLength = 255 as const;
  public readonly minVideoTitleLength = 3 as const;
  public readonly minVideoDescriptionLength = 3 as const;
  public readonly limitWatchHistory = 100 as const;
  public readonly pagination = {
    page: 1,
    pageLimit: 30,
    pageLimitMax: 100,
    pageLimitMin: 10,
    sortBy: "createdAt",
    sortType: "desc",
  } as const;
  public readonly authCookieOptions = {
    // auth cookie options (first-party cookie)
    httpOnly: true,
    secure: true,
    sameSite: "strict" as "strict",
  } as const;
  public readonly thirdPartyCookieOptions = {
    // non-auth cookie options (third-party cookie)
    httpOnly: true,
    secure: true,
    sameSite: "none",
  } as const;
  public readonly videoCategories = [
    "Film & Animation",
    "Autos & Vehicles",
    "Music",
    "Pets & Animals",
    "Sports",
    "Travel & Events",
    "Gaming",
    "People & Blogs",
    "Comedy",
    "Entertainment",
    "News & Politics",
    "Howto & Style",
    "Education",
    "Science & Technology",
    "Nonprofits & Activism",
  ] as const;
  public readonly imageValidMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/tiff",
    "image/bmp",
    "image/svg+xml",
  ];
  public readonly videoValidMimeTypes = [
    "video/mp4",
    "video/ogg",
    "video/webm",
    "video/3gpp",
    "video/3gpp2",
    "video/avi",
    "video/quicktime", // mov
    "video/x-msvideo",
    "video/x-matroska",
    "video/x-ms-wmv",
    "video/x-flv",
    "video/x-m4v",
    "video/mpeg",
  ];
  public readonly audioValidMimeTypes = [
    "audio/mpeg",
    "audio/ogg",
    "audio/wav",
    "audio/webm",
    "audio/aac",
    "audio/x-m4a",
    "audio/x-matroska",
    "audio/x-ms-wma",
  ];
  public readonly validMimeTypes = [
    ...this.imageValidMimeTypes,
    ...this.videoValidMimeTypes,
    ...this.audioValidMimeTypes,
  ];
  public readonly validMimeTypesRegex = new RegExp(
    `(${this.validMimeTypes.join("|")})`,
    "i"
  );
  public readonly validMimeTypesRegexStr = `(${this.validMimeTypes.join("|")})`;
  public readonly base_url =
    `${env.HOST === "localhost" ? `http://${env.HOST}:${env.PORT}` : `https://${env.HOST}`}` as const;
  public readonly webSocketUrl =
    `${this.base_url}${this.webSocketRoutePath}` as const;
  public readonly appName = "ViewTube" as const;
  public readonly appVersion = "1.0.0" as const;
  public readonly appDescription =
    "ViewTube is a platform for viewing videos and works similar to YouTube." as const;
  public readonly rateLimiter = {
    global: {
      requests: 100, // 100 requests
      duration: 1 * 60, // per 1 minute(s)
    },
    sensitive: {
      requests: 5, // 5 requests
      duration: 1 * 60, // per 1 minute(s)
    },
  };
  public readonly corsOptions = {
    origin: [env.FRONTEND_URI],
    credentials: true,
    methods: corsMethods,
  } as CorsOptions;
  public readonly morganOptions = {
    skip: (req: Request, res: Response) => res.statusCode === 304, // skip logging for 304 responses (Not Modified): swagger-ui
  };
  public readonly checkup = {
    http: {
      url: "https://google.com",
    },
    disk: {
      warningThreshold: 75, // 75% disk space warning
      criticalThreshold: 90, // 90% disk space critical
    },
    memory: {
      warningThreshold: 75, // 75% memory warning
      criticalThreshold: 90, // 90% memory critical
    },
  };
}

const ct = new Constants();

export default ct;
