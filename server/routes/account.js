import express from 'express';

import Account from '../controllers/Account';
import validate from '../middlewares/validate';
import accountValidator from '../middlewares/accountValidator';
import authValidator from '../middlewares/authValidator';

const router = express.Router();

const {
  createAccount, getAccount, getAllAccounts, updateAccountStatus, deleteAccount,
} = Account;
const {
  accountNumberValidator,
  accountFieldsValidator,
  accountStatusValidator,
  accountParamValidator,
  duplicateValidator,
} = accountValidator;
const { nameValidator, emailValidator } = authValidator;

router.post('/', accountNumberValidator, nameValidator, emailValidator, accountFieldsValidator, accountStatusValidator, duplicateValidator, validate, createAccount);
router.get('/:accountNumber', accountParamValidator, validate, getAccount);
router.get('/', getAllAccounts);
router.patch('/:accountNumber', accountParamValidator, accountStatusValidator, validate, updateAccountStatus);
router.delete('/:accountNumber', accountParamValidator, validate, deleteAccount);

export default router;
