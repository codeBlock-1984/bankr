import { body, check } from 'express-validator/check';

const authValidator = {
  passwordValidator: [
    body('password')
      .exists({ checkFalsy: true })
      .withMessage('Password is required!')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least six characters long!'),
  ],
  emailValidator: [
    check('email')
      .exists({ checkFalsy: true })
      .withMessage('Email is required!')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email address!')
      .trim(),
  ],
  nameValidator: [
    body('firstName')
      .exists({ checkFalsy: true })
      .withMessage('Firstname is required!')
      .isString()
      .withMessage('First name must be a string!')
      .matches()
      .withMessage('Invalid firstname input!')
      .trim(),
    body('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Lastname is required!')
      .isString()
      .withMessage('Last name must be a string!')
      .trim(),
  ],
};

export default authValidator;
