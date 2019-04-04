import express from 'express';

import transactionController from '../controllers/TransactionController';
import validate from '../middlewares/validate';
import transactionValidator from '../middlewares/transactionValidator';

const router = express.Router();

const { creditTransaction, debitTransaction } = transactionController;
const { transactionFieldsValidator, transactionParamValidator } = transactionValidator;


router.post('/:accountNumber/credit', transactionFieldsValidator, transactionParamValidator, validate, creditTransaction);
router.post('/:accountNumber/debit', transactionFieldsValidator, transactionParamValidator, validate, debitTransaction);

export default router;
