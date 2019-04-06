import { param } from 'express-validator/check';

import users from '../models/userModel';
import BooleanChecker from '../helpers/BooleanChecker';
import arrayFinder from '../helpers/arrayFinder';

const allUsers = [...users];
const { isExisting } = BooleanChecker;

const userValidator = {
  userParamValidator: [
    param('userId')
      .isNumeric()
      .withMessage('User id must be a number!')
      .trim()
      .custom((userId) => {
        const id = parseInt(userId, 10);
        const existingUser = arrayFinder(allUsers, 'id', id);
        return isExisting(existingUser);
      })
      .withMessage('User with specified id not found!'),
  ],
};

export default userValidator;
