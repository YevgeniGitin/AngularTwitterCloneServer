import { Request, Response, NextFunction } from 'express';
import * as membersServices from '../services/members.services';
import { UserToSend } from '../models/user';
import { TweetToSend } from '../models/tweet';

//get member by id
export async function getMemberById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let member: UserToSend | null = await membersServices.getUserById(req.params.id);
    if (member) {
      return res.status(200).send(member);
    } else {
      return res.status(404).send({
        message: 'No member'
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error('getMemberById');
  }
}
//get member's tweets
export async function getMembersTweets(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let id: string = req.params.id;
    //check users id if exists in the db
    let isSuchUser = await membersServices.getUserById(id);
    if (!isSuchUser) {
      return res.status(404).send({ message: 'No member' });
    }
    let tweets: TweetToSend[] = await membersServices.getTweetsByUserId(id,req.headers.authorization);
    res.status(200).send(tweets);
  } catch (err) {
    console.log(err);
    throw new Error('getMemberById');
  }
}
