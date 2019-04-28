import { validationResult } from 'express-validator/check';
import { isNullOrUndefined } from 'util';

const validate = (req, res, next) => {
  const errorData = {};
  const errorFormatter = ({ msg, param }) => {
    if (isNullOrUndefined(errorData[param])) {
      errorData[param] = msg;
    }
    return errorData;
  };
  const validationError = validationResult(req).formatWith(errorFormatter);
  if (!validationError.isEmpty()) {
    const errorMsg = validationError.array()[0];

    return res.status(400).json({
      message: 'Invalid request',
      error: errorMsg,
    });
  }
  return next();
};

export default validate;
