import { faker } from "@faker-js/faker";
import mongoose from "mongoose";

export const seedVideos = async (num: number, ownerId: string) => {
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
