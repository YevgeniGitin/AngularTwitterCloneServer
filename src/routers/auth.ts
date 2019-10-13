import {Router } from 'express';
import * as authController from '../controllers/auth.controllers'
import * as Validation  from '../middlewares/validation';

const router = Router();
//register route
router.post('/register',Validation.passwordValidation,authController.register);
//log in route
router.post('/login',authController.logIn);

export { router };