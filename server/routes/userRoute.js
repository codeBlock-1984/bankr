import express from 'express';

import UserController from '../controllers/UserController';
import TransactionController from '../controllers/TransactionController';
import validate from '../middlewares/validate';
import userValidator from '../middlewares/userValidator';
import AccountController from '../controllers/AccountController';

const router = express.Router();
const { getUser, getAllUsers } = UserController;
const { getUserTransactions } = TransactionController;
const { getUserAccounts } = AccountController;
const {
  userParamValidator,
} = userValidator;

router.get('/:userId', userParamValidator, validate, getUser);
router.get('/', getAllUsers);
router.get('/:userId/transactions', userParamValidator, validate, getUserTransactions);
router.get('/:userId/accounts', userParamValidator, validate, getUserAccounts);

export default router;
