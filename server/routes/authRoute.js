import express from 'express';

import AuthController from '../controllers/AuthController';
import validate from '../middlewares/validate';
import authValidator from '../middlewares/authValidator';

const router = express.Router();
const { signUp, signIn } = AuthController;
const {
  signupValidator,
  signinValidator,
  duplicateValidator,
  userAccountValidator,
} = authValidator;

router.post('/signup', signupValidator, duplicateValidator, validate, signUp);
router.post('/signin', signinValidator, userAccountValidator, validate, signIn);

export default router;
