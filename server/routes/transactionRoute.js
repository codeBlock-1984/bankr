import express from 'express';

import transactionController from '../controllers/TransactionController';
import validate from '../middlewares/validate';
import transactionValidator from '../middlewares/transactionValidator';

const router = express.Router();

const {
  creditTransaction, debitTransaction, getTransaction, getAllTransactions,
} = transactionController;
const {
  transactionFieldsValidator, accountNumberParamValidator, transactionIdParamValidator,
} = transactionValidator;

router.post('/:accountNumber/credit', transactionFieldsValidator, accountNumberParamValidator, validate, creditTransaction);
router.post('/:accountNumber/debit', transactionFieldsValidator, accountNumberParamValidator, validate, debitTransaction);
router.get('/:transactionId', transactionIdParamValidator, validate, getTransaction);
router.get('/', getAllTransactions);

export default router;
