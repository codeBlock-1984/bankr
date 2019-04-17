import { body, param } from 'express-validator/check';
import { sanitizeBody, sanitizeParam } from 'express-validator/filter';

import transactions from '../models/transactions';
import BooleanChecker from '../helpers/BooleanChecker';
import ArraySorter from '../helpers/ArraySorter';

const allTransactions = transactions;
const { isExisting } = BooleanChecker;
const { arrayFinder } = ArraySorter;

const transactionValidator = {
  transactionFieldsValidator: [
    body('amount')
      .exists({ checkFalsy: true })
      .withMessage('Amount is required!')
      .isNumeric()
      .withMessage('Amount must be a number!')
      .trim(),
    sanitizeBody('amount').toFloat(),
    body('cashier')
      .exists({ checkFalsy: true })
      .withMessage('Cashier is required!')
      .isInt()
      .withMessage('Cashier must be a integer!')
      .trim(),
    sanitizeBody('cashier').toInt({ radix: 10 }),
    body('type')
      .exists({ checkFalsy: true })
      .withMessage('Transaction type is required!')
      .isString()
      .withMessage('Transaction type must be a string!')
      .trim(),
  ],
  transactionIdParamValidator: [
    sanitizeParam('transactionId').toInt({ radix: 10 }),
    param('transactionId')
      .isNumeric()
      .withMessage('Transaction id must be a number!')
      .trim()
      .custom((transactionId) => {
        const transId = parseInt(transactionId, 10);
        const existingTransaction = arrayFinder(allTransactions, 'id', transId);
        return isExisting(existingTransaction);
      })
      .withMessage('Transaction with specified id does not exist!'),
  ],
};

export default transactionValidator;
