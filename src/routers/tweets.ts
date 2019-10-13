import {Router } from 'express';
import * as tweetsController from '../controllers/tweets.controllers' 
import { authenticate } from '../middlewares/auth';
import { inputValidation, idValidation } from '../middlewares/validation';

const router = Router();
//get all tweets route
router.get('/',tweetsController.getAllTweets);
//post new tweet route
router.post('/',authenticate(),inputValidation,tweetsController.postNewTweet);
//delete tweet route
router.delete('/:id',authenticate(),idValidation,tweetsController.deleteTweet);
//update the stars of the tweet
router.post('/:id/star-toggle',authenticate(),idValidation,tweetsController.updateStars)

export { router };