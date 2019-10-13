import express from 'express';
import cors from 'cors';
import { router as AuthRouter } from './routers/auth';
import { router as MembersRouter } from './routers/members';
import { router as TweetsRouter } from './routers/tweets';
import { initConfig } from './utils/config';
import { initPassport } from './utils/passport';

initPassport();
initConfig();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//routes
app.use('/api/auth', AuthRouter); //add prefix
app.use('/api/members', MembersRouter); //add prefix
app.use('/api/tweets', TweetsRouter); //add prefix

export { app };
