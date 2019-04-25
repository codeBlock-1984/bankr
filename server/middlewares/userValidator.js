import { param } from 'express-validator/check';
import { sanitizeParam } from 'express-validator/filter';

const userValidator = {
  userParamValidator: [
    sanitizeParam('userId').toInt({ radix: 10 }),
    param('userId')
      .isNumeric()
      .withMessage('User id must be a number!')
      .matches(/(([0-9]+[.]*)+([0-9])*)+$/)
      .withMessage('User id must be a number!')
      .trim(),
  ],
};

export default userValidator;
