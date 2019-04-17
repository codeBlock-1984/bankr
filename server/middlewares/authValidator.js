import { body } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';

import users from '../models/users';
import Passcode from '../helpers/Passcode';
import BooleanChecker from '../helpers/BooleanChecker';
import ArraySorter from '../helpers/ArraySorter';

const allUsers = users;
let existingUser;
const { verifyPassword } = Passcode;
const { isDuplicate, isExisting } = BooleanChecker;
const { arrayFinder } = ArraySorter;

const authValidator = {
  signupValidator: [
    body('firstName')
      .exists({ checkFalsy: true })
      .withMessage('Firstname is required!')
      .isString()
      .withMessage('First name must be a string!')
      .trim(),
    body('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Lastname is required!')
      .isString()
      .withMessage('Last name must be a string!')
      .trim(),
    body('email')
      .exists({ checkFalsy: true })
      .withMessage('Email is required!')
      .isEmail()
      .withMessage('Invalid email address!')
      .trim(),
    body('password')
      .exists({ checkFalsy: true })
      .withMessage('Password is required!')
      .isString()
      .trim(),
    body('isAdmin')
      .exists()
      .withMessage('User isAdmin property is required!')
      .isBoolean()
      .withMessage('Only boolean values allowed for isAdmin!')
      .trim(),
    sanitizeBody('isAdmin').toBoolean({ strict: true }),
    body('type')
      .exists({ checkFalsy: true })
      .withMessage('User type is required!')
      .isIn(['staff', 'client'])
      .withMessage('Invalid user type!')
      .trim(),
  ],
  signinValidator: [
    body('email')
      .exists({ checkFalsy: true })
      .withMessage('Email is required!')
      .isEmail()
      .withMessage('Invalid email address!')
      .trim(),
    body('password')
      .exists({ checkFalsy: true })
      .withMessage('Password is required!')
      .isString()
      .trim(),
  ],
  duplicateValidator: [
    body('email')
      .custom((email) => {
        const duplicateUser = arrayFinder(allUsers, 'email', email);
        return isDuplicate(duplicateUser);
      })
      .withMessage('Email is linked to an existing user!'),
  ],
  userAccountValidator: [
    body('email')
      .custom((email) => {
        existingUser = arrayFinder(allUsers, 'email', email);
        return isExisting(existingUser);
      })
      .withMessage('Email or password incorrect!'),
    body('password')
      .custom(async (password) => {
        try {
          const code = existingUser.password;
          const isVerified = await verifyPassword(password, code);
          return isVerified;
        } catch (error) {
          console.log(error);
        }
      })
      .withMessage('Email or password incorrect!'),
  ],
};

export default authValidator;
