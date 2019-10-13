import mongoose from 'mongoose';
import * as schema from './schemas';
import { DbTweetModel } from '../models/tweet';
import { DbUserModel } from '../models/user';
//connection to tweets collection
var tweetsData: mongoose.Model<DbTweetModel> = mongoose.model<DbTweetModel>(
  'tweets',
  schema.tweetsSchema
);
//connection to tweets collection
var usersData: mongoose.Model<DbUserModel> = mongoose.model<DbUserModel>(
  'users',
  schema.usersSchema
);
//export all the collections
export { tweetsData, usersData };
