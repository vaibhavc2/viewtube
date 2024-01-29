import { envConfig } from "@/config";
import { faker } from "@faker-js/faker";
import * as argon2 from "argon2";
import mongoose from "mongoose";

class GenerateFakeData {
  constructor() {}

  public users = async (num: number) => {
    const users = new Array();

    for (let i = 0; i < num; ++i) {
      const fullName = faker.person.fullName();
      const username = `${fullName.toLowerCase().trim()}_${Math.floor(Math.random() * 1000)}`;
      const _password = "abcdefgh@#123";
      const password = await argon2.hash(_password, {
        secret: Buffer.from(envConfig.secretKey()),
      });
      const email = faker.internet.email();
      const avatar = faker.image.avatar();
      const cover = avatar;
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

  public videos = async (num: number, ownerId: string) => {
    const videos = new Array();

    for (let i = 0; i < num; ++i) {
      const title = faker.lorem.sentence();
      const description = faker.lorem.paragraph();
      const thumbnail = faker.image.url();
      const video = faker.image.url();
      const views = faker.number.int({ min: 0, max: 1000000 });
      const createdAt = faker.date.past();
      const updatedAt = faker.date.recent();
      const owner = new mongoose.Types.ObjectId(ownerId);

      videos.push({
        title,
        description,
        thumbnail,
        video,
        views,
        owner,
        createdAt,
        updatedAt,
      });
    }

    return videos;
  };
}

export const generateFakeData = new GenerateFakeData();
