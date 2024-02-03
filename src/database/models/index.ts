import { Comment, IComment } from "./comment.model";
import { ILike, Like } from "./like.model";
import { IPlaylist, Playlist } from "./playlist.model";
import { ISubscription, Subscription } from "./subscription.model";
import { ITweet, Tweet } from "./tweet.model";
import { IUser, User } from "./user.model";
import { IVideo, Video } from "./video.model";
// import { Notification } from "./notification.model";
// import { Report } from "./report.model";
// import { Tag } from "./tag.model";
// import { Category } from "./category.model";

export type {
  IComment,
  ILike,
  IPlaylist,
  ISubscription,
  ITweet,
  IUser,
  IVideo,
};

class DbModels {
  public models: {
    Video: typeof Video;
    User: typeof User;
    Like: typeof Like;
    Comment: typeof Comment;
    Tweet: typeof Tweet;
    Subscription: typeof Subscription;
    Playlist: typeof Playlist;
  };

  constructor() {
    this.models = {
      Video,
      User,
      Like,
      Comment,
      Tweet,
      Subscription,
      Playlist,
    };
  }
}

export const db = new DbModels().models;
