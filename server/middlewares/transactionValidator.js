import { body, param } from 'express-validator/check';
import { sanitizeBody, sanitizeParam } from 'express-validator/filter';

const transactionValidator = {
  transactionFieldsValidator: [
    body('amount')
      .exists({ checkFalsy: true })
      .withMessage('Amount is required!')
      .isInt()
      .withMessage('Amount must be a number!')
      .matches(/(([0-9]+[.]*)+([0-9])*)+$/)
      .withMessage('Amount must be a number!')
      .trim(),
    sanitizeBody('amount').toFloat(),
  ],
  transactionIdParamValidator: [
    sanitizeParam('transactionId').toInt({ radix: 10 }),
    param('transactionId')
      .isNumeric()
      .withMessage('Transaction id must be a number!')
      .matches(/^[0-9]+$/)
      .withMessage('Transaction id must be a number!')
      .trim(),
  ],
};

export default transactionValidator;
