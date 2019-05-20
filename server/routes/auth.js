import express from 'express';

import Auth from '../controllers/Auth';
import validate from '../middlewares/validate';
import authValidator from '../middlewares/authValidator';

const router = express.Router();
const { signUp, signIn, validateToken } = Auth;
const {
  emailValidator,
  passwordValidator,
  nameValidator,
  tokenValidator,
} = authValidator;

router
  .post('/signup',
    emailValidator, passwordValidator, nameValidator, validate, signUp);

router
  .post('/signin',
    emailValidator, passwordValidator, validate, signIn);

router
  .post('/validate/token',
    tokenValidator, validate, validateToken);

export default router;
