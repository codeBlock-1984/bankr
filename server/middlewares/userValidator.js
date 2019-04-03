import { body } from 'express-validator/check';
import UserModel from '../models/userModel';
import Passcode from '../helpers/Passcode';

const allUsers = UserModel;
const { encryptPassword } = Passcode;

const userValidator = {
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
      .isBoolean()
      .withMessage('Only boolean values allowed for isAdmin!')
      .trim(),
    body('type')
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
        const isNotDuplicate = allUsers.find((user) => { return user.email === email; });
        return !isNotDuplicate;
      })
      .withMessage('Email is linked to an existing user!'),
  ],
  userAccountValidator: [
    body('email')
      .custom((email) => {
        return allUsers.find((user) => { return user.email === email; });
      })
      .withMessage('Email or password incorrect!'),
    body('password')
      .custom(async (password) => {
        const encryptedPassword = await encryptPassword(password);
        return allUsers.find((user) => { return user.password === encryptedPassword; });
      })
      .withMessage('Email or password incorrect!'),
  ],
};

export default userValidator;
