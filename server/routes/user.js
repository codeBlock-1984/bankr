import express from 'express';

import UserController from '../controllers/User';
import validate from '../middlewares/validate';
import userValidator from '../middlewares/userValidator';
import authValidator from '../middlewares/authValidator';
import AccountController from '../controllers/Account';
import Authenticator from '../middlewares/Authenticator';

const router = express.Router();
const {
  createUser,
  getUser,
  getAllUsers,
  deleteUser,
  updatePassword,
  updatePhoto,
} = UserController;

const { getUserAccounts } = AccountController;

const {
  userParamValidator,
  typeValidator,
  passwordUpdateValidator,
  photoUrlValidator,
} = userValidator;

const { nameValidator, emailValidator } = authValidator;

const { isAuth, isAdmin, isSuper } = Authenticator;

router
  .post('/',
    isAuth, isSuper, emailValidator, nameValidator,
    typeValidator, validate, createUser);

router
  .get('/:userId',
    isAuth, isAdmin, userParamValidator, validate, getUser);

router
  .get('/', isAuth, isAdmin, getAllUsers);

router
  .get('/:email/accounts',
    isAuth, emailValidator, validate, getUserAccounts);

router
  .patch('/password',
    isAuth, passwordUpdateValidator, validate, updatePassword);

router
  .patch('/photo',
    isAuth, photoUrlValidator, validate, updatePhoto);

router
  .delete('/:email',
    isAuth, isSuper, emailValidator, validate, deleteUser);

export default router;
