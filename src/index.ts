import express, { Application, Request, Response } from "express";
import { NODE_ENV, PORT } from "./config/config.js";

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  req.body;
  res.send("Welcome to Express & TypeScript Server");
});

app.listen(PORT, () => {
  console.log(
    `Server is running at http://localhost:${PORT} in ${NODE_ENV} mode.`
  );
});
