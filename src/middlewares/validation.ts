import { Request, Response, NextFunction } from 'express';
import * as schema from '../validation/validationScemas';
import joi from 'joi';
import mongoose from 'mongoose';
//password validation by using the pattern
export function passwordValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.body.password;
  const { error, value } = joi.validate(id, schema.passwordschema);
  if (error !== null) {
    return res.status(400).send({
      message: 'bad passwors'
    });
  }
  next();
}
//check the id's type
export function idValidation(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  const ans = mongoose.Types.ObjectId.isValid(id);
  if (!ans) {
    return res.status(400).send({
      message: 'Bad id format'
    });
  }
  next();
}
//check input size 1-240
export function inputValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const text = req.body.text;
  const { error, value } = joi.validate(text, schema.inputchema);
  if (error) {
    return res.status(400).send({
      message: 'Input validation'
    });
  }
  next();
}