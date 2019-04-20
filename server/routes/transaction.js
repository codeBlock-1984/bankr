import express from 'express';

import TransactionController from '../controllers/Transaction';
import validate from '../middlewares/validate';
import transactionValidator from '../middlewares/transactionValidator';
import accountValidator from '../middlewares/accountValidator';

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

router.post('/:accountNumber/credit', accountParamValidator, transactionFieldsValidator, validate, creditTransaction);
router.post('/:accountNumber/debit', accountParamValidator, transactionFieldsValidator, validate, debitTransaction);
router.get('/:transactionId', transactionIdParamValidator, validate, getUserTransaction);
router.get('/', getAllTransactions);

export default router;
