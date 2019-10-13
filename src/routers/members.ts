import {Router } from 'express';
import * as membersController from '../controllers/members.controllers'
import { idValidation } from '../middlewares/validation';

const router = Router();
//get member by id
router.get('/:id',idValidation,membersController.getMemberById);
//get member's tweets
router.get('/:id/tweets',idValidation,membersController.getMembersTweets)

export { router };