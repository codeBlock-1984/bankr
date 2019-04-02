import { body } from 'express-validator/check';
import UserModel from '../models/userModel';
import Passcode from '../helpers/Passcode';

const allUsers = UserModel;
const { encryptPassword } = Passcode;

const userValidator = {
  signupValidator: [
    body('firstname')
      .exists({ checkFalsy: true })
      .withMessage('Firstname is required!')
      .trim(),
    body('lastname')
      .exists({ checkFalsy: true })
      .withMessage('Lastname is required!')
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
