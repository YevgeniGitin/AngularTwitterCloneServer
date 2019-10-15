import { Request, Response, NextFunction } from 'express';
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { IVerifyOptions } from 'passport-local';
import * as authServices from '../services/auth.services';
import { UserToWrite, UserToSend } from '../models/user';
import { keys } from '../utils/config';

const jwtSecret = keys.secret;
const profileUrl = 'https://myfarminfo.com/Tools/Img/Profile/customer.png';
//register new user
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('register');
  try {
    let ans = await authServices.getUserByUserName(req.body.userHandle);
    //check if user name is duplicated
    if (ans) {
      return res.status(409).send({
        message: 'User name is already in use'
      });
    }
    //check if email is duplicated
    ans = await authServices.getUserByemail(req.body.email);
    if (ans) {
      return res.status(409).send({
        message: 'Email is already in use'
      });
    }
    //create user for write do db
    let userToWrite: UserToWrite = {
      avatarUrl: profileUrl,
      email: req.body.email,
      userHandle: req.body.userHandle,
      password: req.body.password,
      registrationDate: authServices.getNowDate(),
      lastLoginDate: authServices.getNowDate()
    };
    //write the user
    let user: UserToSend = await authServices.saveNewUser(userToWrite);
    req.login(userToWrite, { session: false }, error => {
      if (error) {
        return res.send(error);
      }
      //create token
      jwt.sign(
        { id: user._id, userName: user.userHandle },
        jwtSecret,
        (jwtError: Error, token: string) => {
          if (jwtError) {
            res.send(error);
          } else {
            //ctreate user for send back without password

            //send the token and user
            return res.status(201).send({ token, ...user });
          }
        }
      );
    });
  } catch (err) {
    console.log(err);
    throw new Error('register error');
  }
}

export async function logIn(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.log('logIn');
  passport.authenticate(
    'local',
    { session: false },
    (err: Error, user: any, info: IVerifyOptions) => {
      if (err || !user) {
        return res.status(400).send({
          message: 'email or password is incorrect'
        });
      }
      req.login(user, { session: false }, error => {
        if (error) {
          return res.send(error);
        }
        //update users login date
        authServices.updateLoginDate(user._id);
        user.lastLoginDate = authServices.getNowDate();
        jwt.sign(
          { id: user._id, userName: user.userHandle },
          jwtSecret,
          (jwtError: Error, token: string) => {
            if (jwtError) {
              res.send(error);
            } else {
              res.send({ token, ...user });
            }
          }
        );
      });
    }
  )(req, res);
}
