import express from 'express';

import UserController from '../controllers/UserController';
import validate from '../middlewares/validate';
import userValidator from '../middlewares/userValidator';

const router = express.Router();
const { getUser, getAllUsers } = UserController;
const {
  userParamValidator,
} = userValidator;

router.get('/:userId', userParamValidator, validate, getUser);
router.get('/', getAllUsers);

export default router;
