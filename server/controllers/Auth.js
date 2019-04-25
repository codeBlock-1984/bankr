import pool from '../database/db';
import Auth from '../helpers/Auth';
import PasswordAuth from '../helpers/PasswordAuth';
import Responder from '../helpers/Responder';
import authQuery from '../database/queries/auth';

const { createToken } = Auth;
const { encryptPassword, verifyPassword } = PasswordAuth;

const { successResponse, errorResponse } = Responder;

const { addUser, signIn } = authQuery;

class AuthController {
  static async signUp(req, res) {
    const client = await pool.connect();

    try {
      const {
        firstName,
        lastName,
        email,
        password: stringPassword,
      } = req.body;

      const checkValue = [email];

      const {
        rows: checkExistingRows,
      } = await client.query(signIn, checkValue);

      if (checkExistingRows[0]) {
        return res.status(409)
          .json(errorResponse('Email linked to existing user!'));
      }

      const userInputType = 'client';
      const securePassword = await encryptPassword(stringPassword);
      const isAdmin = false;

      const values = [
        firstName,
        lastName,
        email,
        securePassword,
        userInputType,
        isAdmin
      ];

      const { rows } = await client.query(addUser, values);

      if (rows[0]) {
        const newUser = rows[0];
        const { id: userId, type: userType } = newUser;
        const token = createToken({ userId, userType });
        const {
          password, isadmin, ...signupDetails
        } = newUser;
        const newSignup = { token, ...signupDetails };

        return res
          .status(201)
          .json(successResponse([newSignup]));
      }
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }

  static async signIn(req, res) {
    const client = await pool.connect();

    try {
      const { email, password } = req.body;
      const values = [email];
      const { rows } = await client.query(signIn, values);

      if (!rows[0]) {
        return res.status(400)
          .json(errorResponse('Email or password incorrect!'));
      }

      const singleUser = rows[0];
      const { password: singleUserPassword } = singleUser;
      const isVerified = await verifyPassword(password, singleUserPassword);

      if (!isVerified) {
        return res.status(400)
          .json(errorResponse('Email or password incorrect!'));
      }

      const { id: userId, type: userType } = singleUser;
      const token = createToken({ userId, userType });

      const {
        password: userPassword,
        isadmin,
        createdon,
        updatedon,
        ...signinDetails
      } = singleUser;

      const newSignin = { token, ...signinDetails };

      return res
        .status(200)
        .json(successResponse([newSignin]));
    } catch (error) {
      return res.status(500)
        .json('Internal server error!');
    } finally {
      await client.release();
    }
  }
}

export default AuthController;
