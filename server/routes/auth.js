import express from 'express';

import Auth from '../controllers/Auth';
import validate from '../middlewares/validate';
import authValidator from '../middlewares/authValidator';

const router = express.Router();
const { signUp, signIn } = Auth;
const {
  nameValidator,
  emailValidator,
  passwordValidator,
  signupValidator,
} = authValidator;

router.post('/signup', nameValidator, emailValidator, passwordValidator, signupValidator, validate, signUp);
router.post('/signin', emailValidator, passwordValidator, validate, signIn);

export default router;
