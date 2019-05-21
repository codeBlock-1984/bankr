import { param, body } from 'express-validator/check';
import { sanitizeParam, sanitizeBody } from 'express-validator/filter';

const userValidator = {
  userParamValidator: [
    param('userId')
      .isNumeric()
      .withMessage('User id must be a number!')
      .matches(/(([0-9]+[.]*)+([0-9])*)+$/)
      .withMessage('User id must be a number!')
      .trim(),
    sanitizeParam('userId').toInt({ radix: 10 }),
  ],
  typeValidator: [
    sanitizeBody('type').customSanitizer((value) => {
      const lowerCaseValue = value.toLowerCase();
      return lowerCaseValue;
    }),
    body('type')
      .exists({ checkFalsy: true })
      .withMessage('User type is required!')
      .isIn(['cashier', 'admin'])
      .withMessage('Invalid user type!')
      .trim(),
  ],
  passwordUpdateValidator: [
    body('newPassword')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('New password is required.')
      .isLength({ min: 6, max: 20 })
      .withMessage('New password must be between 6 to 20 characters long.'),
    body('oldPassword')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Old password is required.')
      .isLength({ min: 6, max: 20 })
      .withMessage('Old password must be between 6 to 20 characters long.'),
  ],
};

export default userValidator;
