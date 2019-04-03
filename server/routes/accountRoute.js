import express from 'express';

import AccountController from '../controllers/AccountController';
import validate from '../middlewares/validate';
import accountValidator from '../middlewares/accountValidator';

const router = express.Router();

const { createAccount } = AccountController;
const { accountFieldsValidator, duplicateValidator } = accountValidator;

router.post('/', accountFieldsValidator, duplicateValidator, validate, createAccount);

export default router;
