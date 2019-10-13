import mongoose from 'mongoose';

export interface User {
  userHandle: string;
  email: string;
  avatarUrl: string;
  registrationDate: string;
  lastLoginDate: string;
}
export interface UserToken {
  id: string;
  userName: string;
}
export interface UserToSend extends User {
  _id: string;
}
export interface UserToWrite extends User {
  password: string;
}
export interface DbUserModel extends mongoose.Document, UserToWrite {
  _id: string;
}
