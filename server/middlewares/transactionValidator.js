import { body, param } from 'express-validator/check';
import { sanitizeBody, sanitizeParam } from 'express-validator/filter';

import accounts from '../models/accounts';
import transactions from '../models/transactions';
import BooleanChecker from '../helpers/BooleanChecker';
import ArraySorter from '../helpers/ArraySorter';

const allAccounts = accounts;
const allTransactions = transactions;
const { isExisting } = BooleanChecker;
const { arrayFinder } = ArraySorter;

const transactionValidator = {
  transactionFieldsValidator: [
    body('accountNumber')
      .exists({ checkFalsy: true })
      .withMessage('Account number is required!')
      .isNumeric()
      .withMessage('Account number must be a number!')
      .trim(),
    sanitizeBody('accountNumber').toInt({ radix: 10 }),
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
  accountNumberParamValidator: [
    sanitizeParam('accountNumber').toInt({ radix: 10 }),
    param('accountNumber')
      .isNumeric()
      .withMessage('Account number must be a number!')
      .trim()
      .custom((accountNumber) => {
        const existingAccount = arrayFinder(allAccounts, 'accountNumber', accountNumber);
        return isExisting(existingAccount);
      })
      .withMessage('Account with specified account number does not exist!'),
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
