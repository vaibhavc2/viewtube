import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { FRONTEND_URI } from "../config/config.js";
import { __limit } from "../constants/express/index.js";
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

// using custom middlewares
// app.use(authMiddleware);
app.use(uploadFileLocally.single("file"));

// using routes
// app.use("/api/v1/users", usersRouter);

app.get("/", (req: Request, res: Response) => {
  req.body = "Hello World";
  res.send("Welcome to Express & TypeScript Server");
});

app.get("/favicon.ico", (req: Request, res: Response) => res.status(204));

// error handler middlewares
app.use(apiErrorMiddleware);
app.use(errorMiddleware);
