import express, { Request, Response, Application } from "express";
import sanitizedConfig from "./config/config.js";

const app: Application = express();

const { PORT, NODE_ENV } = sanitizedConfig;

const port = PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.listen(port, () => {
  console.log(
    `Server is running at http://localhost:${port} in ${NODE_ENV} mode.`
  );
});
