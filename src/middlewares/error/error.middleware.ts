import { Request, Response } from "express";
import { InternalServerErrorResponse } from "../../utils/api/res/api-response.util.js";

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response
) => {
  console.error(`⚠️   Error occurred on the route: ${req.path} :: `, error); //

  return res.status(500).json(new InternalServerErrorResponse());
};
