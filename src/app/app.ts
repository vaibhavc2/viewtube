import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { FRONTEND_URI } from "../config/config.js";
import { __limit } from "../constants/express/index.js";
import { authMiddleware } from "../middlewares/auth/auth.middleware.js";
import { cacheGetter } from "../middlewares/cache/cache-getter.middleware.js";
import { cacheSetter } from "../middlewares/cache/cache-setter.middleware.js";
import { cacheUpdater } from "../middlewares/cache/cache-updater.middleware.js";
import { uploadFileLocally } from "../middlewares/config/multer.middleware.js";
import { apiErrorMiddleware } from "../middlewares/error/api-error.middleware.js";
import { errorMiddleware } from "../middlewares/error/error.middleware.js";

export const app: Application = express();

// using pre-built middlewares
app.use(
  cors({
    origin: [FRONTEND_URI],
    credentials: true,
    // methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());
app.use(
  express.json({
    limit: __limit,
  })
);
app.use(express.urlencoded({ extended: true, limit: __limit }));
app.use(express.static("public"));

// authentication middleware
app.use(authMiddleware);

// using multer middleware
// TODO: Efficiency: maybe apply the Multer middleware directly to the routes that need it... ?
app.use(uploadFileLocally.single("file"));

// TODO: make middleware for cloudinary service: uploadFileToCloudinary

// cache getter middleware
app.use(cacheGetter);

// TODO: check caching for routes!

// using routes
// app.use("/api/v1/users", usersRouter);

app.get("/", (req: Request, res: Response) => {
  req.body = "Hello World";
  res.send("Welcome to Express & TypeScript Server");
});

// cache setter and updater middlewares
app.use(cacheSetter);
app.use(cacheUpdater);

app.get("/favicon.ico", (req: Request, res: Response) => res.status(204));

// error handler middlewares
app.use(apiErrorMiddleware);
app.use(errorMiddleware);
