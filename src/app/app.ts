import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { FRONTEND_URI } from "../config/config.js";
import { __limit } from "../constants/express/index.js";
import { errorMiddleware } from "../middlewares/error.js";

export const app: Application = express();

// using main middlewares
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

// using routes
// app.use("/api/v1/users", usersRouter);
// app.use("/api/v1/persons", personsRouter);

app.get("/", (req: Request, res: Response) => {
  req.body = "Hello World";
  res.send("Welcome to Express & TypeScript Server");
});

// error handler middleware
app.use(errorMiddleware);
