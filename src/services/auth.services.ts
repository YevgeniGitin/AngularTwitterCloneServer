import * as collections from '../store/collections';
import { UserToWrite, UserToSend, DbUserModel } from '../models/user';
const dateFormat = require('dateformat');

//checks if user name is already in use
export async function getUserByUserName(name: string):Promise<DbUserModel | null> {
  try {
    let ans:DbUserModel | null = await collections.usersData.findOne({ userHandle: name }).exec();
    return ans;
  } catch (err) {
    console.log(err);
    throw new Error('getUserByUserName');
  }
}
//checks if email is already in use
export async function getUserByemail(email: string):Promise<DbUserModel | null> {
  try {
    let ans:DbUserModel | null = await collections.usersData.findOne({ email: email }).exec();
    return ans;
  } catch (err) {
    console.log(err);
    throw new Error('getUserByUserName');
  }
}
//save new user
export async function saveNewUser(user: UserToWrite): Promise<UserToSend> {
  try {
    let ans:DbUserModel = await collections.usersData.create(user);
    //create user without password to send to the client
    let userToSend: UserToSend = {
      _id: ans._id,
      userHandle: ans.userHandle,
      email: ans.email,
      avatarUrl: ans.avatarUrl,
      registrationDate: ans.registrationDate,
      lastLoginDate: ans.lastLoginDate
    };
    return userToSend;
  } catch (err) {
    console.log(err);
    throw new Error('saveNewUser');
  }
}
//get user by email and password
export async function getUserByEmailAndPassword(email: string,password: string):Promise<UserToSend | null> {
  try {
    let ans = await collections.usersData.findOne({ email: email, password: password },{ password: 0 }).exec();
    let userToSend: UserToSend | null = null;
    if (ans) {
      userToSend = {
        _id: ans._id,
        userHandle: ans.userHandle,
        email: ans.email,
        avatarUrl: ans.avatarUrl,
        registrationDate: ans.registrationDate,
        lastLoginDate: ans.lastLoginDate
      };
    }
    return userToSend;
  } catch (err) {
    console.log(err);
    throw new Error('saveNewUser');
  }
}
//return now date as as string in dd/mm/yyyy format
export function getNowDate(): string {
  let day = dateFormat(new Date(), 'dd/mm/yyyy');
  return day;
}
//updates the users last log in date when the user is log in
export async function updateLoginDate(id: string) {
  try {
    let date: string = getNowDate();
    await collections.usersData
      .updateOne({ _id: id }, { $set: { lastLoginDate: date } })
      .exec();
  } catch (err) {
    console.log(err);
    throw new Error('updateLoginDate');
  }
}
