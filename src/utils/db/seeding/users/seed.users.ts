import { SECRET_KEY } from "@/config/config";
import { faker } from "@faker-js/faker";
import * as argon2 from "argon2";

export const seedUsers = async (num: number) => {
  const users = new Array();

  for (let i = 0; i < num; ++i) {
    const fullName = faker.person.fullName();
    const username = `${faker.person.fullName().toLowerCase()}_${Math.floor(Math.random() * 1000)}`;
    const _password = "abcdefgh@#123";
    const password = await argon2.hash(_password, {
      secret: Buffer.from(SECRET_KEY),
    });
    const email = faker.internet.email();
    const avatar = faker.image.avatar();
    const cover = faker.image.avatar();
    const channelDescription = faker.lorem.paragraph();
    const createdAt = faker.date.past();
    const updatedAt = faker.date.recent();

    users.push({
      fullName,
      username,
      password,
      email,
      avatar,
      cover,
      channelDescription,
      createdAt,
      updatedAt,
    });
  }

  return users;
};
