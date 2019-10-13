import { Request, Response, NextFunction } from 'express';
import * as tweetsServices from '../services/tweets.services';
import { TweetToSend, TweetToSendAfterCreate, DbTweetModel, Star } from '../models/tweet';
import * as collections from '../store/collections';
//get all tweets
export async function getAllTweets(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let tweets: TweetToSend[] = await tweetsServices.getAllTweets(
      req.headers.authorization
    );
    return res.status(200).send(tweets);
  } catch (err) {
    console.log('getAllTweets');
    throw new Error(err);
  }
}
//write new tweet
export async function postNewTweet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let tweet: TweetToSendAfterCreate | null = await tweetsServices.saveNewTweet(
      req.body.text,
      req.headers.authorization
    );
    return res.status(201).send(tweet);
  } catch (err) {
    console.log('postNewTweet');
    throw new Error(err);
  }
}
//delete tweet
export async function deleteTweet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let id: string = req.params.id;
    let token: string | undefined = req.headers.authorization;
    let tweet: DbTweetModel | null = await collections.tweetsData.findOne({ _id: id }).exec();
    let isMyTweet: boolean;
    if (!tweet) {
      return res.status(404).send({ message: 'Tweet not found' });
    }
    //check if it user's tweet 
    isMyTweet = await tweetsServices.IsMyTweet(tweet, token);
    if (isMyTweet) {//delete if it user's tweet only
      await collections.tweetsData.deleteOne({ _id: id }).exec();
      return res.sendStatus(204);
    } else {
      return res.status(403).send({ message: 'Not the owner' });
    }
  } catch (err) {
    console.log('postNewTweet');
    throw new Error(err);
  }
}
//update the stars array
export async function updateStars(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let id: string = req.params.id;
    let token: string | undefined = req.headers.authorization;
    let tweet: DbTweetModel | null = await collections.tweetsData.findById({_id: id}).exec();
    let starsAns: Star;
    if (!tweet) {
      res.status(404).send(
        { message: 'Tweet not found' }
        );
    } else {
      starsAns = await tweetsServices.updateStars(id, token);
      res.status(200).send(starsAns);
    }
  } catch (err) {
    console.log('postNewTweet');
    throw new Error(err);
  }
}
