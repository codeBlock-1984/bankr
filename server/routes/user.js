import express from 'express';

import User from '../controllers/User';
import Transaction from '../controllers/Transaction';
import validate from '../middlewares/validate';
import userValidator from '../middlewares/userValidator';
import Account from '../controllers/Account';

const router = express.Router();
const { getUser, getAllUsers } = User;
const { getUserTransaction, getUserTransactions } = Transaction;
const { getUserAccounts } = Account;
const {
  userParamValidator,
} = userValidator;

router.get('/:userId', userParamValidator, validate, getUser);
router.get('/', getAllUsers);
router.get('/:userId/accounts/accountId/transactions/:transactionId', userParamValidator, validate, getUserTransaction);
router.get('/:userId/accounts/:accountId/transactions', userParamValidator, validate, getUserTransactions);
router.get('/:userId/accounts', userParamValidator, validate, getUserAccounts);

export default router;
