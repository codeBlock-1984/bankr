import { param } from 'express-validator/check';
import { sanitizeParam } from 'express-validator/filter';

const actionValidator = {
  actionParamValidator: [
    param('admin')
      .isNumeric()
      .withMessage('Admin id must be a number!')
      .matches(/(([0-9]+[.]*)+([0-9])*)+$/)
      .withMessage('Admin id must be a number!')
      .trim(),
    sanitizeParam('admin').toInt({ radix: 10 }),
  ],
};

export default actionValidator;
