import { body, param } from 'express-validator/check';
import { sanitizeBody, sanitizeParam } from 'express-validator/filter';

const transactionValidator = {
  transactionFieldsValidator: [
    body('amount')
      .exists({ checkFalsy: true })
      .withMessage('Amount is required.')
      .isFloat()
      .withMessage('Amount must be a number!')
      .matches(/(([0-9]+[.]*)+([0-9])*)+$/)
      .withMessage('Invalid amount.')
      .isLength({ max: 7 })
      .withMessage('Amount has exceeded cap.')
      .trim(),
    sanitizeBody('amount').toFloat(),
  ],
  transactionIdParamValidator: [
    sanitizeParam('transactionId').toInt({ radix: 10 }),
    param('transactionId')
      .isInt()
      .withMessage('Transaction id must be a number.')
      .matches(/[0-9]+$/)
      .withMessage('Transaction id must be a number.')
      .trim(),
  ],
};

export default transactionValidator;
