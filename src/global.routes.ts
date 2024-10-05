import apiV1Router from "@/api/v1/router";
import { Router } from "express";

const apiRouter = Router();

// redirect to '/api-docs' at '/'
apiRouter.get("/", (req, res) => {
  res.redirect("/api-docs");
});

apiRouter.use("/api/v1", apiV1Router);
// ... add more routers versions here ...

export default apiRouter;
