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

const { emailParamValidator } = authValidator;

const { isAuth, levelThree } = Authenticator;

router.get('/:userId', isAuth, levelThree, userParamValidator, validate, getUser);
router.get('/', isAuth, levelThree, getAllUsers);
router.get('/:email/accounts', isAuth, emailParamValidator, validate, getUserAccounts);

export default router;
