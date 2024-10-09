import { SubscriptionController } from "@/api/v1/controllers/subscription.controller";
import auth from "@/common/middlewares/auth.middleware";
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
    /**
     * @openapi
     * /subscriptions/{userId}:
     *   get:
     *     tags:
     *       - Subscriptions
     *     summary: Get number of subscribers
     *     description: Get number of subscribers
     *     parameters:
     *       - name: userId
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     */
    this.router.get("/:userId", this.controller.getSubscriberCount);

    // the routes below require authentication
    this.router.use(auth.user);

    /**
     * @openapi
     * /subscriptions/{userId}:
     *   post:
     *     tags:
     *       - Subscriptions
     *     summary: Add subscription
     *     description: Add subscription
     *     parameters:
     *       - name: userId
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     */
    this.router.post("/:userId", this.controller.addSubscription);

    /**
     * @openapi
     * /subscriptions/{userId}:
     *   delete:
     *     tags:
     *       - Subscriptions
     *     summary: Remove subscription
     *     description: Remove subscription
     *     parameters:
     *       - name: userId
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Success
     *       400:
     *         description: Bad request
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal server error
     */
    this.router.delete("/:userId", this.controller.removeSubscription);
  }
}

export const subscriptionsRouter = new SubscriptionRouter().router;
