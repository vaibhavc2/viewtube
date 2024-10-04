import { SuccessResponse } from "@/common/utils/api-response.util";
import { asyncHandler } from "@/common/utils/async-handler.util";
import { Request, Response } from "express";

export class AppHealthController {
  public testAppHealth = asyncHandler(async (req: Request, res: Response) => {
    // get the current time
    const now = new Date().toLocaleString();

    // return the response
    res
      .status(200)
      .json(
        new SuccessResponse(
          `The server is running 'OK' and the current time is ${now}`
        )
      );
  });
}
