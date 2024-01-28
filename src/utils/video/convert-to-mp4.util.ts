import { path } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import { deleteLocalFile } from "../files/delete-local-file.util";
import { wLogger } from "../log/logger.util";
import { printErrorMessage } from "../server/error/print-error-message.util";

ffmpeg.setFfmpegPath(path);

export const convertToMp4 = async (videoUrl: string) => {
  return new Promise((resolve: (value: string) => void, reject) =>
    ffmpeg(videoUrl)
      .output(`${videoUrl.split(".")[0]}.mp4`)
      .on("end", async () => {
        await deleteLocalFile(videoUrl);
        wLogger.info("✅   Converted video to MP4!");
        resolve(`${videoUrl.split(".")[0]}.mp4`);
      })
      .on("error", async (err) => {
        await deleteLocalFile(videoUrl);
        printErrorMessage(err, "convertToMp4");
        reject(err);
      })
      .run()
  );
};
