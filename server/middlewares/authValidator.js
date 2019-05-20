import { body, check } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';

const authValidator = {
  tokenValidator: [
    body('token')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Token is required.')
      .matches(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
      .withMessage('Invalid token.'),
  ],
  passwordValidator: [
    body('password')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Password is required.')
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between 6 to 20 characters long.'),
  ],
  emailValidator: [
    check('email')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Email is required.')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email address.'),
  ],
  nameValidator: [
    body('firstName')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('First name is required.')
      .isString()
      .withMessage('Invalid first name.')
      .isLength({ max: 20 })
      .withMessage('First name must not exceed 20 characters.'),
    sanitizeBody('firstName').customSanitizer((value) => {
      const titleCaseValue = value.toLowerCase()
        .replace(value[0], value[0].toUpperCase());
      return titleCaseValue;
    }),
    body('lastName')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Last name is required.')
      .isString()
      .withMessage('Invalid last name.')
      .isLength({ max: 20 })
      .withMessage('Last name must not exceed 20 characters.'),
    sanitizeBody('lastName').customSanitizer((value) => {
      const titleCaseValue = value.toLowerCase()
        .replace(value[0], value[0].toUpperCase());
      return titleCaseValue;
    }),
  ],
};

export default authValidator;
