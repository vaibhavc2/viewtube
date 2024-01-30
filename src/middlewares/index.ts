import { Authentication } from "./auth.middleware";
import { ErrorMiddleware } from "./error.middleware";
import { FilesMiddleware } from "./files.middleware";
import { ValidationMiddleware } from "./validation.middleware";

class Middlewares {
  auth: Authentication;
  error: ErrorMiddleware;
  files: FilesMiddleware;
  validation: ValidationMiddleware;

  constructor() {
    this.auth = new Authentication();
    this.error = new ErrorMiddleware();
    this.files = new FilesMiddleware();
    this.validation = new ValidationMiddleware();
  }
}

export const middlewares = new Middlewares();
