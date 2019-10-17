import { Router } from 'express';
import * as authController from '../controllers/auth.controllers';
import * as Validation from '../middlewares/validation';
const multer = require('multer');

var storage = multer.diskStorage({
  //where to save the image
  destination: function(req: any, file: any, cb: any) {
    cb(null, 'src/images');
  },
  //what name to give to the image
  filename: function(req: any, file: any, cb: any) {
    cb(null, req.body.email+req.body.userHandle + file.originalname);
  }
});
//use the diskStorage
const upload = multer({ storage: storage });

const router = Router();
//register route
router.post('/register',Validation.passwordValidation,upload.single('image'),authController.register);
//log in route
router.post('/login', authController.logIn);

export { router };
