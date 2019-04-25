import { validationResult } from 'express-validator/check';

const validate = (req, res, next) => {
  const errorFormatter = ({ msg }) => {
    return msg;
  };
  const validationError = validationResult(req).formatWith(errorFormatter);
  if (!validationError.isEmpty()) {
    const errorMsg = validationError.array();

    return res.status(400).json({
      status: 400,
      error: errorMsg,
    });
  }
  return next();
};

export default validate;
