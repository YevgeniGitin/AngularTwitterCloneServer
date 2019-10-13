import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { getUserByEmailAndPassword } from '../services/auth.services';
import * as collections from '../store/collections';
import { keys } from './config';

const JwtSecret = keys.secret;
export async function initPassport() {
  try {
    passport.use(
      new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password'
        },
        async (userName, password, callback) => {
          const user = await getUserByEmailAndPassword(userName, password);
          if (user) {
            callback(null, user, { message: 'succeeded' });
          } else {
            callback(null, false, { message: 'failed' });
          }
        }
      )
    );

    passport.use(
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: JwtSecret
        },
        (jwtPayload, callback) =>
          callback(
            null,
            //check the token if it is our system token
            collections.usersData.findOne({
              _id: jwtPayload.id,
              userHandle: jwtPayload.userName
            })
          )
      )
    );
  } catch {
    throw new Error('log in');
  }
}
