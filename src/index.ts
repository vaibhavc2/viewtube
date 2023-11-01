import { app } from "./app/app.js";
import { NODE_ENV, PORT } from "./config/config.js";
import { connectDB } from "./database/connect-db.js";

connectDB();

app.listen(PORT, () => {
  console.log(
    `Server is running at http://localhost:${PORT} in ${NODE_ENV} mode.`
  );
});
