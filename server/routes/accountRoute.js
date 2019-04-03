import express from 'express';

import AccountController from '../controllers/AccountController';
import validate from '../middlewares/validate';
import accountValidator from '../middlewares/accountValidator';

const router = express.Router();

const { createAccount, updateAccountStatus, deleteAccount } = AccountController;
const {
  accountFieldsValidator, accountStatusValidator, accountParamValidator, duplicateValidator,
} = accountValidator;

router.post('/', accountFieldsValidator, accountStatusValidator, duplicateValidator, validate, createAccount);
router.patch('/:accountNumber', accountParamValidator, accountStatusValidator, validate, updateAccountStatus);
router.delete('/:accountNumber', accountParamValidator, validate, deleteAccount);

export default router;
