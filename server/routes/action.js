import express from 'express';

import ActionController from '../controllers/Action';
import authenticator from '../middlewares/Authenticator';
import validate from '../middlewares/validate';

const router = express.Router();

const { getActionsAdmin } = ActionController;
const { isAuth, isSuper } = authenticator;

router.get('/',
  isAuth, isSuper, validate, getActionsAdmin);

export default router;
