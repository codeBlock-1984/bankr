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
  accountFieldsValidator,
  statusValidator,
  accountParamValidator,
} = accountValidator;

const { isAuth, isUser, isAdmin } = Authenticator;

router
  .post('/', isAuth, isUser, accountFieldsValidator, validate, createAccount);

router
  .get('/:accountNumber',
    isAuth, isUser, accountParamValidator, validate, getAccount);

router
  .get('/', isAuth, isAdmin, getAllAccounts);

router
  .get('/:accountNumber/transactions',
    isAuth, isUser, accountParamValidator, validate, getUserTransactions);

router
  .patch('/:accountNumber',
    isAuth, isAdmin, accountParamValidator,
    statusValidator, validate, updateAccountStatus);

router
  .delete('/:accountNumber',
    isAuth, isAdmin, accountParamValidator, validate, deleteAccount);

export default router;
