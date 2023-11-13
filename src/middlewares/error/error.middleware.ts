import { Request, Response } from "express";

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response
) => {
  console.error(`⚠️   Error occurred on the route: ${req.path} :: `, error); //

  const errorMessage = "Internal Server Error";
  const statusCode = 500;

  return res.status(statusCode).json({
    success: false,
    message: errorMessage,
  });
};
