import { body, param } from 'express-validator/check';

import accounts from '../models/accountModel';

const allAccounts = accounts;

const accountValidator = {
  accountFieldsValidator: [
    body('accountNumber')
      .exists({ checkFalsy: true })
      .withMessage('Account number is required!')
      .isNumeric()
      .withMessage('Account number must be a number!')
      .trim(),
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
      .trim(),
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
    param('accountNumber')
      .isNumeric()
      .withMessage('Account number must be a number!')
      .trim()
      .custom((accountNumber) => {
        return allAccounts.find((account) => {
          return account.accountNumber === accountNumber;
        });
      })
      .withMessage('Account with specified account number does not exist!'),
  ],
  duplicateValidator: [
    body('accountNumber')
      .custom((accountNumber) => {
        const isNotDuplicate = allAccounts.find((account) => {
          return account.accountNumber === accountNumber;
        });
        return !isNotDuplicate;
      })
      .withMessage('Account number is linked to an existing account!'),
  ],
};

export default accountValidator;