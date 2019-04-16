import { body, param } from 'express-validator/check';
import { sanitizeBody, sanitizeParam } from 'express-validator/filter';

import accounts from '../models/accounts';
import BooleanChecker from '../helpers/BooleanChecker';
import ArraySorter from '../helpers/ArraySorter';

const allAccounts = accounts;
const { isExisting, isDuplicate } = BooleanChecker;
const { arrayFinder } = ArraySorter;

const accountValidator = {
  accountFieldsValidator: [
    body('accountNumber')
      .exists({ checkFalsy: true })
      .withMessage('Account number is required!')
      .isNumeric()
      .withMessage('Account number must be a number!')
      .trim(),
    sanitizeBody('accountNumber').toInt({ radix: 10 }),
    body('firstName')
      .exists({ checkFalsy: true })
      .withMessage('Firstname is required!')
      .isString()
      .withMessage('First name must be a string!')
      .trim(),
    body('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Lastname is required!')
      .isString()
      .withMessage('Last name must be a string!')
      .trim(),
    body('email')
      .exists({ checkFalsy: true })
      .withMessage('Email is required!')
      .isEmail()
      .withMessage('Invalid email address!')
      .trim()
      .normalizeEmail(),
    body('owner')
      .exists({ checkFalsy: true })
      .withMessage('Owner id is required!')
      .isInt(10)
      .withMessage('Owner id must be an integer!')
      .trim(),
    sanitizeBody('owner').toInt({ radix: 10 }),
    body('type')
      .exists({ checkFalsy: true })
      .withMessage('Account type is required!')
      .isIn(['savings', 'current'])
      .withMessage('Invalid account type!')
      .trim(),
    body('openingBalance')
      .exists({ checkFalsy: true })
      .withMessage('Opening balance is required!')
      .isFloat()
      .withMessage('Invalid opening balance value!')
      .trim(),
    sanitizeBody('openingBalance').toFloat(),
  ],
  accountStatusValidator: [
    body('status')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Account status is required!')
      .isIn(['active', 'dormant'])
      .withMessage('Invalid account status!')
      .trim(),
  ],
  accountParamValidator: [
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
  duplicateValidator: [
    sanitizeBody('accountNumber').toInt({ radix: 10 }),
    body('accountNumber')
      .custom((accountNumber) => {
        const duplicateAccount = arrayFinder(allAccounts, 'accountNumber', accountNumber);
        return isDuplicate(duplicateAccount);
      })
      .withMessage('Account number is linked to an existing account!'),
  ],
};

export default accountValidator;
