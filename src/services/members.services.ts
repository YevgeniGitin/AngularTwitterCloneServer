import * as collections from '../store/collections';
import { UserToSend, UserToken } from '../models/user';
import jwt from 'jsonwebtoken';
import { TweetToSend } from '../models/tweet';

//get user by id
export async function getUserById(id: string): Promise<UserToSend | null> {
  try {
    let ans = await collections.usersData.findById({ _id: id },{ password: 0 }).exec();
    let user: UserToSend | null = null;
    if (ans) {
      //build ans object
      user = {
        _id: ans._id,
        userHandle: ans.userHandle,
        email: ans.email,
        avatarUrl: ans.avatarUrl,
        registrationDate: ans.registrationDate,
        lastLoginDate: ans.lastLoginDate
      };
    }
    return user;
  } catch (err) {
    console.log(err);
    throw new Error('getUserById error');
  }
}
//get decoded token as object with the users id and name
export async function getDecodedToken(token: string | undefined): Promise<UserToken | null> {
  try {
    if (token) {
      let tokenStart = token.indexOf(' ') + 1;
      let tokenEnd = token.length - 1;
      let decodedToken: UserToken = JSON.parse(
        JSON.stringify(jwt.decode(token.substring(tokenStart, tokenEnd)))
      );
      return decodedToken;
    } else {
      return null;
    }
    //if some error meens that it is not our system token
  } catch (err) {
    console.log(err);
    return null;
  }
}
//check if get token and if the user exists in the db
export async function isAuthorized(token: UserToken | null): Promise<boolean> {
  try {
    if (token) {
      return getUserById(token.id) ? true : false;
    } else {
      return false;
    }
    //if some error meens that it is not our system token
  } catch (err) {
    return false;
  }
}
//get member id and return his tweets and return if connect user did star or not
export async function getTweetsByUserId(id: string,
  authorizationToken: string | undefined
): Promise<TweetToSend[]> {
  try {
    //check if get token and if the user data inside the token exists in the db
    let token: UserToken | null = await getDecodedToken(authorizationToken);
    let authorized: boolean = await isAuthorized(token);
    let tweets = await collections.tweetsData.find({ userId: id }).exec();
    let tweetsToSend: TweetToSend[] = [];
    let starredByMe: boolean;
    for (let tweet of tweets) {
      starredByMe = false;
      if (authorized && token) {//check if we get a token from the client and check if it good token
        let name: string = token.userName;
        if (tweet.stars.find(userName => userName === name)) {//check if connected user starred the tweet
          starredByMe = true;
        }
      }
      //create tweet object to send
      let TweetToSend: TweetToSend = {
        _id: tweet._id,
        stars: tweet.stars.length,
        starredByMe: starredByMe,
        text: tweet.text,
        userId: tweet.userId,
        userHandle: tweet.userHandle,
        postDate: tweet.postDate,
        avatarUrl: tweet.avatarUrl
      };
      tweetsToSend.push(TweetToSend);
    }
    return tweetsToSend;
  } catch (err) {
    console.log(err);
    return [];
  }
}
