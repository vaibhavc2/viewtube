import { db } from "@/database/models";
import { generateFakeData } from "@/services/fake-data.service";
import ApiError from "@/utils/api-error.util";
import { CreatedResponse } from "@/utils/api-response.util";
import { Request, Response } from "express";

export const seedFakeUsers = async (req: Request, res: Response) => {
  const { num = 50, drop = 0 } = req.query;

  if (isNaN(+num)) {
    throw new ApiError(400, "Number of users must be a number.");
  }
  if (isNaN(+drop)) {
    throw new ApiError(400, "Drop must be a number. (representing boolean)");
  }

  const users = await generateFakeData.users(+num);

  if (+drop) {
    await db.User.collection.drop();
  }

  const insertedUsers = await db.User.insertMany(users);

  if (!insertedUsers) {
    throw new ApiError(500, "Failed to seed users.");
  }

  res.status(201).json(
    new CreatedResponse("Successfully seeded users.", {
      users: insertedUsers,
    })
  );
};
