import { SubscriptionController } from "@/controllers/subscription/subscription.controller";
import { verifyAuthentication } from "@/middlewares/auth/auth.middleware";
import { Router } from "express";

class SubscriptionRouter {
  public router: Router;
  public controller: SubscriptionController;

  constructor() {
    this.router = Router();
    this.controller = new SubscriptionController();
    this.routes();
  }

  public routes() {
    this.router.get("/:userId", this.controller.getSubscriberCount);

    // the routes below require authentication
    this.router.use(verifyAuthentication);

    this.router.post("/add/:userId", this.controller.addSubscription);
    this.router.delete("/remove/:userId", this.controller.removeSubscription);
  }
}

export const subscriptionsRouter = new SubscriptionRouter().router;
