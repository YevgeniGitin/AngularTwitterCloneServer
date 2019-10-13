import mongoose from 'mongoose';

export interface Tweet {
  text: string;
  userId: string;
  userHandle: string;
  postDate: string;
  avatarUrl: string;
}
export interface TweetToWrite extends Tweet {
  stars: string[];
}
export interface TweetToSend extends TweetToSendAfterCreate {
  starredByMe: boolean;
}
export interface TweetToSendAfterCreate extends Tweet {
  _id: string;
  stars: number;
}

export interface DbTweetModel extends mongoose.Document, TweetToWrite {
  _id: string;
}

export interface Star {
  stars: number;
  starredByMe: boolean;
}
