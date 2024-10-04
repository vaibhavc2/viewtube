import { Comment, IComment } from "@/common/models/comment.model";
import { ILike, Like } from "@/common/models/like.model";
import { IPlaylist, Playlist } from "@/common/models/playlist.model";
import {
  ISubscription,
  Subscription,
} from "@/common/models/subscription.model";
import { ITweet, Tweet } from "@/common/models/tweet.model";
import { IUser, User } from "@/common/models/user.model";
import { IVideo, Video } from "@/common/models/video.model";
// import { Notification } from "@/common/models/notification.model";
// import { Report } from "@/common/models/report.model";
// import { Tag } from "@/common/models/tag.model";
// import { Category } from "@/common/models/category.model";

export type {
  IComment,
  ILike,
  IPlaylist,
  ISubscription,
  ITweet,
  IUser,
  IVideo,
};

class DBClient {
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

export const db = new DBClient().models;
