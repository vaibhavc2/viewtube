import { seedUsers } from "@/utils/db/seeding/users/seed.users";

class SeedDB {
  constructor() {}

  users = async (num: number) => {
    return await seedUsers(num);
  };
}

const seedDatabase = new SeedDB();

export { seedDatabase };
