import { validationResult } from 'express-validator/check';

const validate = (req, res, next) => {
  const errorFormatter = ({ msg }) => {
    return msg;
  };
  const validationError = validationResult(req).formatWith(errorFormatter);
  if (!validationError.isEmpty()) {
    const errorMsg = validationError.array()[0];
    if (errorMsg.search('not exist') !== -1 || errorMsg.search('not found') !== -1) {
      return res.status(404).json({
        status: 404,
        error: errorMsg,
      });
    }
    return res.status(400).json({
      status: 400,
      error: errorMsg,
    });
  }
  return next();
};

export default validate;
