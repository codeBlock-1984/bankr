import { body, param } from 'express-validator/check';

import accounts from '../models/accountModel';
import transactions from '../models/transactionModel';
import BooleanChecker from '../helpers/BooleanChecker';
import arrayFinder from '../helpers/arrayFinder';

const allAccounts = [...accounts];
const allTransactions = [...transactions];
const { isExisting } = BooleanChecker;

const transactionValidator = {
  transactionFieldsValidator: [
    body('accountNumber')
      .exists({ checkFalsy: true })
      .withMessage('Account number is required!')
      .isNumeric()
      .withMessage('Account number must be a number!')
      .trim(),
    body('amount')
      .exists({ checkFalsy: true })
      .withMessage('Amount is required!')
      .isNumeric()
      .withMessage('Amount must be a number!')
      .trim(),
    body('cashier')
      .exists({ checkFalsy: true })
      .withMessage('Cashier is required!')
      .isInt()
      .withMessage('Cashier must be a integer!')
      .trim(),
    body('type')
      .exists({ checkFalsy: true })
      .withMessage('Transaction type is required!')
      .isString()
      .withMessage('Transaction type must be a string!')
      .trim(),
  ],
  accountNumberParamValidator: [
    param('accountNumber')
      .isNumeric()
      .withMessage('Account number must be a number!')
      .trim()
      .custom((accountNumber) => {
        const accNumber = parseInt(accountNumber, 10);
        const existingAccount = arrayFinder(allAccounts, 'accountNumber', accNumber);
        return isExisting(existingAccount);
      })
      .withMessage('Account with specified account number does not exist!'),
  ],
  transactionIdParamValidator: [
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
