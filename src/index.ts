import { app } from "./app/app.js";
import { NODE_ENV, PORT } from "./config/config.js";
import { connectDB } from "./database/connect-db.js";
import { wLogger } from "./utils/log/logger.util.js";
import { printErrorMessage } from "./utils/server/error/print-error-message.util.js";

connectDB()
  .then(() => {
    app.on("error", (error) => {
      printErrorMessage(
        error,
        "EXPRESS Server FAILED :: at app.on() in index.ts"
      );
      process.exit(1);
    });
    app.listen(PORT, () => {
      wLogger.info(
        `⚙️   Server is running at http://localhost:${PORT} in ${NODE_ENV} mode.`
      );
    });
  })
  .catch((error) => {
    printErrorMessage(
      error,
      "MONGODB Connection FAILED :: at connectDB() in index.ts"
    );
    process.exit(1);
  });
