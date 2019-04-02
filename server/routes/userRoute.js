import express from 'express';

import UserController from '../controllers/UserController';
import validate from '../middlewares/validate';
import userValidator from '../middlewares/userValidator';

const router = express.Router();
const { signUp } = UserController;
const { signupValidator } = userValidator;

router.post('/signup', signupValidator, validate, signUp);

export default router;
