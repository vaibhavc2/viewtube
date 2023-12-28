import fs from "fs/promises";
import { printErrorMessage } from "../server/error/print-error-message.util.js";

const buff = Buffer.alloc(100);
const header = Buffer.from("mvhd");

export const getVideoLength = async (path: string) => {
  try {
    // const file = await fs.open(path, "r");
    // const { buffer } = await file.read(buff, 0, 100, 0);

    // await file.close();

    // const start = buffer.indexOf(header) + 17;
    // const timeScale = buffer.readUInt32BE(start);
    // const duration = buffer.readUInt32BE(start + 4);

    // const movieLength = Math.floor((duration / timeScale) * 1000) / 1000;

    const buf = Buffer.alloc(100);
    const file = await fs.open(path, "r");
    const { buffer } = await file.read({
      buffer: buf,
      length: 100,
      offset: 0,
      position: 0,
    });
    await file.close();

    const start = buffer.indexOf(Buffer.from("mvhd")) + 16;
    const timeScale = buffer.readUInt32BE(start);
    const duration = buffer.readUInt32BE(start + 4);

    const movieLength = Math.floor(duration / timeScale);

    return movieLength;
  } catch (error) {
    printErrorMessage(error, "getVideoLength()");
    return null;
  }
};
