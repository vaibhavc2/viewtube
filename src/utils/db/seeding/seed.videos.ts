import { faker } from "@faker-js/faker";

export const seedVideos = async (num: number) => {
  const videos = new Array();

  for (let i = 0; i < num; ++i) {
    const title = faker.lorem.sentence();
    const description = faker.lorem.paragraph();
    const thumbnail = faker.image.url();
    const video = "";
    const views = faker.number.int({ min: 0, max: 1000000 });
    const createdAt = faker.date.past();
    const updatedAt = faker.date.recent();

    videos.push({
      title,
      description,
      thumbnail,
      video,
      views,
      createdAt,
      updatedAt,
    });
  }

  return videos;
};
