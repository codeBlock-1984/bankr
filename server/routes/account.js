import express from 'express';

import AccountController from '../controllers/Account';
import TransactionController from '../controllers/Transaction';
import validate from '../middlewares/validate';
import accountValidator from '../middlewares/accountValidator';

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

router.post('/', accountNumberValidator, accountFieldsValidator, accountStatusValidator, validate, createAccount);
router.get('/:accountNumber', accountParamValidator, validate, getAccount);
router.get('/', getAllAccounts);
router.get('/:accountNumber/transactions', accountParamValidator, validate, getUserTransactions);
router.patch('/:accountNumber', accountParamValidator, accountStatusValidator, validate, updateAccountStatus);
router.delete('/:accountNumber', accountParamValidator, validate, deleteAccount);

export default router;
