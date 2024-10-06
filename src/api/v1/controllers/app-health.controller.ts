import ct from "@/common/constants";
import checkupService from "@/common/services/checkup.service";
import ApiResponse from "@/common/utils/api-response.util";
import { asyncHandler } from "@/common/utils/async-handler.util";
import { Request, Response } from "express";

export class AppHealthController {
  public testAllHealth = asyncHandler(async (req: Request, res: Response) => {
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

  public testAppHealth = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(
      new ApiResponse(200, "Ping-Pong! App health check successful!", {
        time: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      })
    );
  });

  public testDbHealth = asyncHandler(async (req: Request, res: Response) => {
    const db = await checkupService.dbCheck();
    res.status(200).json(
      new ApiResponse(200, "Database health check successful!", {
        time: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        results: { db },
      })
    );
  });

  public testDiskHealth = asyncHandler(async (req: Request, res: Response) => {
    const disk = await checkupService.diskCheck();
    res.status(200).json(
      new ApiResponse(200, "Disk health check successful!", {
        time: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        results: { disk },
      })
    );
  });

  public testMemoryHealth = asyncHandler(
    async (req: Request, res: Response) => {
      const memory = await checkupService.memoryCheck();
      res.status(200).json(
        new ApiResponse(200, "Memory health check successful!", {
          time: new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
          }),
          results: { memory },
        })
      );
    }
  );

  public testHttpHealth = asyncHandler(async (req: Request, res: Response) => {
    const google = await checkupService.httpCheck(ct.checkup.http.url);
    res.status(200).json(
      new ApiResponse(200, "HTTP health check successful!", {
        time: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        results: { google },
      })
    );
  });
}
