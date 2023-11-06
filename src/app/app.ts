import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { FRONTEND_URI } from "../config/config.js";
import { errorMiddleware } from "../middlewares/error.js";

export const app: Application = express();

// using middlewares
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: [FRONTEND_URI],
    credentials: true,
    // methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// using routes
// app.use("/api/v1/users", usersRouter);
// app.use("/api/v1/persons", personsRouter);

app.get("/", (req: Request, res: Response) => {
  req.body = "Hello World";
  res.send("Welcome to Express & TypeScript Server");
});

// error handler middleware
app.use(errorMiddleware);
