import { body } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';

const authValidator = {
  nameValidator: [
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
  ],
  emailValidator: [
    body('email')
      .exists({ checkFalsy: true })
      .withMessage('Email is required!')
      .isEmail()
      .withMessage('Invalid email address!')
      .trim(),
  ],
  passwordValidator: [
    body('password')
      .exists({ checkFalsy: true })
      .withMessage('Password is required!')
      .isString()
      .trim(),
  ],
  signupValidator: [
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
};

export default authValidator;
