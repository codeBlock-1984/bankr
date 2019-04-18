import { body, param } from 'express-validator/check';
import { sanitizeBody, sanitizeParam } from 'express-validator/filter';

const accountValidator = {
  accountNumberValidator: [
    body('accountNumber')
      .exists({ checkFalsy: true })
      .withMessage('Account number is required!')
      .isNumeric()
      .withMessage('Account number must be a number!')
      .trim(),
    sanitizeBody('accountNumber').toInt({ radix: 10 }),
  ],
  accountFieldsValidator: [
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
      .trim(),
  ],
  statusParamValidator: [
    param('status')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Account status is required!')
      .isIn(['active', 'dormant'])
      .withMessage('Invalid account status!')
      .trim(),
  ],
};

export default accountValidator;
