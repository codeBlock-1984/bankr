import express from 'express';

import Account from '../controllers/Account';
import validate from '../middlewares/validate';
import accountValidator from '../middlewares/accountValidator';
import authValidator from '../middlewares/authValidator';

const router = express.Router();

const {
  createAccount,
  getAccount,
  getAllAccounts,
  getAccountsByStatus,
  updateAccountStatus, deleteAccount,
} = Account;
const {
  accountNumberValidator,
  accountFieldsValidator,
  accountStatusValidator,
  accountParamValidator,
} = accountValidator;
const { nameValidator, emailValidator } = authValidator;

router.post('/', accountNumberValidator, nameValidator, emailValidator, accountFieldsValidator, accountStatusValidator, validate, createAccount);
router.get('/:accountNumber', accountParamValidator, validate, getAccount);
router.get('/', getAllAccounts);
router.get('/accountStatus', accountStatusValidator, validate, getAccountsByStatus);
router.patch('/:accountNumber', accountParamValidator, accountStatusValidator, validate, updateAccountStatus);
router.delete('/:accountNumber', accountParamValidator, validate, deleteAccount);

export default router;
