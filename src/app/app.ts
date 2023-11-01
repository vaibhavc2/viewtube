import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { FRONTEND_URI } from "../config/config.js";
import { errorMiddleware } from "../middlewares/error.js";

export const app: Application = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: [FRONTEND_URI],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(errorMiddleware);

app.get("/", (req: Request, res: Response) => {
  req.body = "Hello World";
  res.send("Welcome to Express & TypeScript Server");
});
