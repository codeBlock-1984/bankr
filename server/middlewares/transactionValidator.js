import { body, param } from 'express-validator/check';

import accounts from '../models/accountModel';
import BooleanChecker from '../helpers/BooleanChecker';
import arrayFinder from '../helpers/arrayFinder';

const allAccounts = accounts;
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
  transactionParamValidator: [
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
};

export default transactionValidator;
