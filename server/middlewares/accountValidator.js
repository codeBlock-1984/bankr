import { body, param } from 'express-validator/check';
import { sanitizeParam, sanitizeBody } from 'express-validator/filter';

const accountValidator = {
  accountFieldsValidator: [
    body('type')
      .exists({ checkFalsy: true })
      .withMessage('Account type is required!')
      .isIn(['savings', 'current', 'loan'])
      .withMessage('Invalid account type!')
      .trim(),
    sanitizeBody('type').customSanitizer((value) => {
      const lowerCaseValue = value.toLowerCase();
      return lowerCaseValue;
    }),
  ],
  statusValidator: [
    body('status')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Account status is required!')
      .isIn(['active', 'dormant'])
      .withMessage('Invalid account status.')
      .trim(),
    sanitizeBody('status').customSanitizer((value) => {
      const lowerCaseValue = value.toLowerCase();
      return lowerCaseValue;
    }),
  ],
  accountParamValidator: [
    sanitizeParam('accountNumber').toInt({ radix: 10 }),
    param('accountNumber')
      .isInt()
      .withMessage('Invalid account number.')
      .matches(/[0-9]+$/)
      .withMessage('Invalid account number.')
      .trim(),
  ],
};

export default accountValidator;
