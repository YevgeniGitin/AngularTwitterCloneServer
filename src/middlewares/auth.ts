import passport from 'passport';

export function authenticate(callback?: (...args: any[]) => any) {
  return passport.authenticate('jwt', { session: false }, callback);
}
