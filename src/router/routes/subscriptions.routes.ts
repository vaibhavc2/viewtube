import { SubscriptionController } from "@/controllers/subscription/subscription.controller";
import { middlewares } from "@/middlewares";
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
    this.router.use(middlewares.auth.user);

    this.router.post("/add/:userId", this.controller.addSubscription);
    this.router.delete("/remove/:userId", this.controller.removeSubscription);
  }
}

export const subscriptionsRouter = new SubscriptionRouter().router;
