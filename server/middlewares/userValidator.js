import { param } from 'express-validator/check';
import { sanitizeParam } from 'express-validator/filter';

import users from '../models/userModel';
import BooleanChecker from '../helpers/BooleanChecker';
import ArraySorter from '../helpers/ArraySorter';

const allUsers = users;
const { isExisting } = BooleanChecker;
const { arrayFinder } = ArraySorter;

const userValidator = {
  userParamValidator: [
    sanitizeParam('userId').toInt({ radix: 10 }),
    param('userId')
      .isNumeric()
      .withMessage('User id must be a number!')
      .trim()
      .custom((userId) => {
        const existingUser = arrayFinder(allUsers, 'id', userId);
        return isExisting(existingUser);
      })
      .withMessage('User with specified id not found!'),
  ],
};

export default userValidator;
