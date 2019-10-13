import mongoose from 'mongoose';

export const tweetsSchema = new mongoose.Schema(
  {
    text: String,
    userId: String,
    userHandle: String,
    postDate: String,
    avatarUrl: String,
    stars: [String]
  },
  {
    versionKey: false // You should be aware of the outcome after set to false
  }
);

export const usersSchema = new mongoose.Schema(
  {
    avatarUrl: String,
    email: String,
    userHandle: String,
    password: String,
    registrationDate: String,
    lastLoginDate: String
  },
  {
    versionKey: false // You should be aware of the outcome after set to false
  }
);
