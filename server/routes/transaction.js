import express from 'express';

import Transaction from '../controllers/Transaction';
import validate from '../middlewares/validate';
import transactionValidator from '../middlewares/transactionValidator';
import accountValidator from '../middlewares/accountValidator';

const router = express.Router();

const {
  creditTransaction, debitTransaction, getTransaction, getAllTransactions,
} = Transaction;
const {
  transactionFieldsValidator, transactionIdParamValidator,
} = transactionValidator;
const { accountParamValidator, accountNumberValidator } = accountValidator;

router.post('/:accountNumber/credit', accountParamValidator, accountNumberValidator, transactionFieldsValidator, validate, creditTransaction);
router.post('/:accountNumber/debit', accountParamValidator, accountNumberValidator, transactionFieldsValidator, validate, debitTransaction);
router.get('/:transactionId', transactionIdParamValidator, validate, getTransaction);
router.get('/', getAllTransactions);

export default router;
