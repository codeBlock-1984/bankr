import express from 'express';

import AccountController from '../controllers/Account';
import TransactionController from '../controllers/Transaction';
import validate from '../middlewares/validate';
import accountValidator from '../middlewares/accountValidator';
import Authenticator from '../middlewares/Authenticator';

const router = express.Router();

const {
  createAccount,
  getAccount,
  getAllAccounts,
  updateAccountStatus, deleteAccount,
} = AccountController;

const { getUserTransactions } = TransactionController;

const {
  accountNumberValidator,
  accountFieldsValidator,
  accountStatusValidator,
  accountParamValidator,
} = accountValidator;

const { isAuth, levelFour, levelFive } = Authenticator;

router.post('/', isAuth, levelFour, accountNumberValidator, accountFieldsValidator, accountStatusValidator, validate, createAccount);
router.get('/:accountNumber', isAuth, accountParamValidator, validate, getAccount);
router.get('/', isAuth, levelFive, getAllAccounts);
router.get('/:accountNumber/transactions', isAuth, accountParamValidator, validate, getUserTransactions);
router.patch('/:accountNumber', isAuth, levelFive, accountParamValidator, accountStatusValidator, validate, updateAccountStatus);
router.delete('/:accountNumber', isAuth, levelFive, accountParamValidator, validate, deleteAccount);

export default router;
