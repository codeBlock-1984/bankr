import express from 'express';

import Auth from '../controllers/Auth';
import validate from '../middlewares/validate';
import authValidator from '../middlewares/authValidator';

const router = express.Router();
const { signUp, signIn } = Auth;
const {
  signinValidator,
  signupValidator,
} = authValidator;

router.post('/signup', signinValidator, signupValidator, validate, signUp);
router.post('/signin', signinValidator, validate, signIn);

export default router;
