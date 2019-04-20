import express from 'express';

import UserController from '../controllers/User';
import validate from '../middlewares/validate';
import userValidator from '../middlewares/userValidator';
import authValidator from '../middlewares/authValidator';
import AccountController from '../controllers/Account';

const router = express.Router();
const { getUser, getAllUsers } = UserController;
const { getUserAccounts } = AccountController;
const {
  userParamValidator,
} = userValidator;
const { emailParamValidator } = authValidator;

router.get('/:userId', userParamValidator, validate, getUser);
router.get('/', getAllUsers);
router.get('/:email/accounts', emailParamValidator, validate, getUserAccounts);

export default router;
