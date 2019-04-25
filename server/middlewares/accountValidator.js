import { body, param } from 'express-validator/check';
import { sanitizeParam, sanitizeBody } from 'express-validator/filter';

const accountValidator = {
  accountFieldsValidator: [
    sanitizeBody('type').customSanitizer((value) => {
      const lowerCaseValue = value.toLowerCase();
      return lowerCaseValue;
    }),
    body('type')
      .exists({ checkFalsy: true })
      .withMessage('Account type is required!')
      .isIn(['savings', 'current', 'loan'])
      .withMessage('Invalid account type!')
      .trim(),
  ],
  statusValidator: [
    sanitizeBody('status').customSanitizer((value) => {
      const lowerCaseValue = value.toLowerCase();
      return lowerCaseValue;
    }),
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
      .withMessage('Invalid account number!')
      .matches(/^[0-9]+$/)
      .withMessage('Invalid account number!')
      .trim(),
  ],
};

export default accountValidator;
