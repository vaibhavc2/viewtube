import { NextFunction, Request, Response } from "express";
import { RequiredBodyError } from "../../utils/api/error/api-error.util.js";

export const requiredFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields = [];
    const keys = Object.keys(req.body); // Included fields

    // Checks if every required field is in the body
    for (const field of fields)
      if (!keys.includes(field)) missingFields.push(field);

    // If there are missing fields then run next error middleware
    if (missingFields.length) return next(new RequiredBodyError(missingFields));

    // If no missing fields then run router code
    return next();
  };
};
