// import { IVideo, db } from "@/database/models";
// import ApiError from "@/utils/api-error.util";
// import WebSocket from "ws";

// export class NotificationController {
//   private wss: WebSocket.Server;
//   private userConnections: Map<string, WebSocket>;

//   constructor(wss: WebSocket.Server, userConnections: Map<string, WebSocket>) {
//     this.wss = wss;
//     this.userConnections = userConnections;
//   }

//   public sendNotification(userId: string, message: string) {
//     // Find the WebSocket connection for the user
//     const ws = this.findWebSocketConnectionForUser(userId);

//     if (ws) {
//       // Send the notification to the user
//       ws.send(JSON.stringify({ type: "notification", message }));
//     }
//   }

//   private findWebSocketConnectionForUser(userId: string): WebSocket | null {
//     // find the WebSocket connection for the user
//     const ws = this.userConnections.get(userId);

//     return ws ? ws : null;
//   }

//   public broadcastNotification(message: string) {
//     // Broadcast the notification to all users
//     this.wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify({ type: "notification", message }));
//       }
//     });
//   }

//   public async notifySubscribersOfNewVideo(videoId: string, message: string) {
//     // Get the video or channel from the database
//     const video = await this.getVideoFromDb(videoId);

//     // Get the channelId
//     const channelId = video.owner;

//     // Get the subscribers of the video or channel
//     const subscribers = await this.getSubscribersFromDb(channelId);

//     // Send a notification to each subscriber
//     for (const subscriberId of subscribers) {
//       this.sendNotification(subscriberId, message);
//     }
//   }

//   private async getVideoFromDb(videoId: string) {
//     // Get the video from the database
//     const video = await db.Video.findById(videoId);

//     // check if the video exists
//     if (!video) {
//       ws.send(JSON.stringify(new ApiError(404, "Video not found")));
//     }

//     return video;
//   }
// }
