import { param } from 'express-validator/check';
import { sanitizeParam } from 'express-validator/filter';

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
};

export default userValidator;
