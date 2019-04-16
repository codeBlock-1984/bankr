import express from 'express';

import Account from '../controllers/Account';
import validate from '../middlewares/validate';
import accountValidator from '../middlewares/accountValidator';

const router = express.Router();

const {
  createAccount, getAccount, getAllAccounts, updateAccountStatus, deleteAccount,
} = Account;
const {
  accountFieldsValidator, accountStatusValidator, accountParamValidator, duplicateValidator,
} = accountValidator;

router.post('/', accountFieldsValidator, accountStatusValidator, duplicateValidator, validate, createAccount);
router.get('/:accountNumber', accountParamValidator, validate, getAccount);
router.get('/', getAllAccounts);
router.patch('/:accountNumber', accountParamValidator, accountStatusValidator, validate, updateAccountStatus);
router.delete('/:accountNumber', accountParamValidator, validate, deleteAccount);

export default router;
