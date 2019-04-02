import { body } from 'express-validator/check';

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
};

export default userValidator;
