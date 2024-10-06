import ct from "@/common/constants";
import checkupService from "@/common/services/checkup.service";
import ApiResponse from "@/common/utils/api-response.util";
import { asyncHandler } from "@/common/utils/async-handler.util";
import { Request, Response } from "express";

export class AppHealthController {
  public testAppHealth = asyncHandler(async (req: Request, res: Response) => {
    const google = await checkupService.httpCheck(ct.checkup.http.url);
    const db = await checkupService.dbCheck();
    const disk = await checkupService.diskCheck();
    const memory = await checkupService.memoryCheck();

    const results = {
      google,
      db,
      disk,
      memory,
    };

    // return the response
    res.status(200).json(
      new ApiResponse(200, "App health check successful!", {
        time: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        results,
      })
    );
  });
}
