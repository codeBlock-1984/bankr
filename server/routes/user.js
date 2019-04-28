import express from 'express';

import UserController from '../controllers/User';
import validate from '../middlewares/validate';
import userValidator from '../middlewares/userValidator';
import authValidator from '../middlewares/authValidator';
import AccountController from '../controllers/Account';
import Authenticator from '../middlewares/Authenticator';

const router = express.Router();
const { getUser, getAllUsers } = UserController;

const { getUserAccounts } = AccountController;

const { userParamValidator } = userValidator;

const { emailValidator } = authValidator;

const { isAuth, isAdmin } = Authenticator;

router
  .get('/:userId',
    isAuth, isAdmin, userParamValidator, validate, getUser);

router
  .get('/', isAuth, isAdmin, getAllUsers);

router
  .get('/:email/accounts',
    isAuth, emailValidator, validate, getUserAccounts);

export default router;
