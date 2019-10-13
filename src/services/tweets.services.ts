import {TweetToSend, TweetToWrite, DbTweetModel, TweetToSendAfterCreate, Star} from '../models/tweet';
import * as collections from '../store/collections';
import { UserToken, DbUserModel } from '../models/user';
import * as membersServices from '../services/members.services';
const dateFormat = require('dateformat');

//return now date as as string in dd/mm/yyyy format
export function getNowDate(): string {
  let day = dateFormat(new Date(), 'dd/mm/yyyy');
  return day;
}
//get all tweets
export async function getAllTweets(authorizationToken: string | undefined): Promise<TweetToSend[]> {
  try {
    //get the token
    let token: UserToken | null = await membersServices.getDecodedToken(
      authorizationToken
    );
    //check if is authorized
    let authorized: boolean = await membersServices.isAuthorized(token);
    //get all tweets from db
    let tweets = await collections.tweetsData.find({}).exec();
    let tweetsToSend: TweetToSend[] = [];
    let starredByMe: boolean;
    //create ans tweet list to send
    for (let tweet of tweets) {
      starredByMe = false;
      if (authorized && token) {
        let name: string = token.userName;
        if (tweet.stars.find(userName => userName === name)) {
          starredByMe = true;
        }
      }
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
    throw new Error(err);
  }
}
//write new tweet to db
export async function saveNewTweet(text: string,
  authorizationToken: string | undefined
): Promise<TweetToSendAfterCreate | null> {
  try {
    let tweet: TweetToWrite;
    //get the token
    let token: UserToken | null = await membersServices.getDecodedToken(authorizationToken);
    let user: DbUserModel | null;
    let ans: DbTweetModel;
    let tweetToSend: TweetToSendAfterCreate | null = null;
    if (token) {
      user = await collections.usersData.findById({ _id: token.id }).exec();
      if (user) {
        tweet = {
          text: text,
          userId: user._id,
          userHandle: user.userHandle,
          postDate: getNowDate(),
          avatarUrl: user.avatarUrl,
          stars: []
        };
        ans = await collections.tweetsData.create(tweet);
        tweetToSend = {
          _id: ans._id,
          stars: 0,
          text: ans.text,
          userId: ans.userId,
          userHandle: ans.userHandle,
          postDate: ans.postDate,
          avatarUrl: ans.avatarUrl
        };
        return tweetToSend;
      }
    }
    return tweetToSend;
  } catch (err) {
    throw new Error(err);
  }
}
//function that checks if the tweet is posted by connected user
export async function IsMyTweet(
  tweet: DbTweetModel | null,
  authorizationToken: string | undefined
): Promise<boolean> {
  try {
    let token: UserToken | null = await membersServices.getDecodedToken(authorizationToken);
    if (token && tweet) {
      return (tweet.userId === token.id) ? true : false;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

export async function updateStars(
  id: string,
  authorizationToken: string | undefined
): Promise<Star> {
  try {
    let token: UserToken | null = await membersServices.getDecodedToken(
      authorizationToken
    );
    let tweet: DbTweetModel | null = await collections.tweetsData
      .findById({ _id: id })
      .exec();
    let isStared: boolean = false;
    //get the tweet's stars array
    let stars: string[] = tweet ? tweet.stars : [];
    if (token) {
      let name: string = token.userName;
      isStared = stars.find(userName => userName === name) ? true : false;
      //if user starred delete his star else add his star to the tweet
      if (isStared) {
        let index: number = stars.findIndex(userName => userName === name);
        stars.splice(index, 1);
      } else {
        stars.push(name);
      }
      //update stars array
      await collections.tweetsData
        .updateOne({ _id: id }, { $set: { stars: stars } })
        .exec();
    }
    //create star object
    let starsAns: Star = {
      stars: stars.length,
      starredByMe: !isStared
    };
    return starsAns;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }

  // let ans=await collections.tweetsData.updateOne({ _id: id }, { $set: { title: 'Hello2' }}).exec();
}
