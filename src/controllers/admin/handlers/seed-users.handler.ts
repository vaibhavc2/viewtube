import { User } from "@/models/user.model";
import ApiError from "@/utils/api/error/api-error.util";
import { CreatedResponse } from "@/utils/api/res/api-response.util";
import { seedUsers } from "@/utils/db/seeding/seed.users";
import { Request, Response } from "express";

export const seedFakeUsers = async (req: Request, res: Response) => {
  const { num = 50, drop = 0 } = req.query;

  if (isNaN(Number(num))) {
    throw new ApiError(400, "Number of users must be a number.");
  }
  if (isNaN(Number(drop))) {
    throw new ApiError(400, "Drop must be a number. (representing boolean)");
  }

  const users = await seedUsers(Number(num));

  if (Number(drop)) {
    await User.collection.drop();
  }

  const insertedUsers = await User.insertMany(users);

  if (!insertedUsers) {
    throw new ApiError(500, "Failed to seed users.");
  }

  res.status(201).json(
    new CreatedResponse("Successfully seeded users.", {
      users: insertedUsers,
    })
  );
};
