import express from 'express';

import TransactionController from '../controllers/Transaction';
import validate from '../middlewares/validate';
import transactionValidator from '../middlewares/transactionValidator';
import accountValidator from '../middlewares/accountValidator';
import Authenticator from '../middlewares/Authenticator';

const router = express.Router();

const {
  creditTransaction,
  debitTransaction,
  getUserTransaction,
  getAllTransactions,
} = TransactionController;

const {
  transactionFieldsValidator,
  transactionIdParamValidator,
} = transactionValidator;

const { accountParamValidator } = accountValidator;

const {
  isAuth, isUser, isCashier, isAdmin,
} = Authenticator;

router
  .post('/:accountNumber/credit',
    isAuth, isCashier, accountParamValidator,
    transactionFieldsValidator, validate, creditTransaction);

router
  .post('/:accountNumber/debit',
    isAuth, isCashier, accountParamValidator,
    transactionFieldsValidator, validate, debitTransaction);

router
  .get('/:transactionId',
    isAuth, isUser, transactionIdParamValidator, validate, getUserTransaction);

router.get('/', isAuth, isAdmin, getAllTransactions);

export default router;
