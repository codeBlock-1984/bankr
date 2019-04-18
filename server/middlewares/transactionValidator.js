import { body, param } from 'express-validator/check';
import { sanitizeBody, sanitizeParam } from 'express-validator/filter';

const transactionValidator = {
  transactionFieldsValidator: [
    body('amount')
      .exists({ checkFalsy: true })
      .withMessage('Amount is required!')
      .isNumeric()
      .withMessage('Amount must be a number!')
      .trim(),
    sanitizeBody('amount').toFloat(),
    body('account')
      .exists({ checkFalsy: true })
      .withMessage('Account is required!')
      .isInt()
      .withMessage('Account must be a integer!')
      .trim(),
    sanitizeBody('account').toInt({ radix: 10 }),
    body('owner')
      .exists({ checkFalsy: true })
      .withMessage('Owner is required!')
      .isInt()
      .withMessage('Owner must be a integer!')
      .trim(),
    sanitizeBody('owner').toInt({ radix: 10 }),
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
      .trim(),
  ],
};

export default transactionValidator;
