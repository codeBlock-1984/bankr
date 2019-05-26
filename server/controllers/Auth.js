import pool from '../database/db';
import Auth from '../helpers/Auth';
import PasswordAuth from '../helpers/PasswordAuth';
import Responder from '../helpers/Responder';
import authQuery from '../database/queries/auth';

const { createToken, verifyToken } = Auth;
const { encryptPassword, verifyPassword } = PasswordAuth;

const { successResponse, messageResponse, errorResponse } = Responder;

const { addUser, signIn } = authQuery;

/**
 * @description Defines methods for user authentication
 *
 * @class AuthController
 */
class AuthController {
  /**
   * @description Creates a new user account
   * @static
   * @async
   *
   * @param {object} req - signup request object
   * @param {object} res - signup response object
   *
   * @returns
   * @memberof AuthController
   */
  static async signUp(req, res) {
    const client = await pool.connect();

    try {
      const {
        firstName: firstNameInput,
        lastName: lastNameInput,
        email: emailInput,
        password: stringPassword,
      } = req.body;

      const checkValue = [emailInput];

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
        firstNameInput,
        lastNameInput,
        emailInput,
        securePassword,
        userInputType,
        isAdmin
      ];

      const { rows } = await client.query(addUser, values);

      if (rows[0]) {
        const {
          id,
          firstname: firstName,
          lastname: lastName,
          email,
          type,
          photourl,
        } = rows[0];

        const {
          id: userId,
          type: userType,
        } = rows[0];
        const token = createToken({ userId, userType });

        const signupDetails = {
          id,
          firstName,
          lastName,
          email,
          type,
          photourl,
        };
        const newSignup = { token, ...signupDetails };

        const msg = 'User account successfully created.';
        return res
          .status(201)
          .json(successResponse(msg, [newSignup]));
      }
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }

  /**
   * @description Log in authenticated user
   * @static
   * @async
   *
   * @param {object} req - signin request object
   * @param {object} res - signin response object
   *
   * @returns
   * @memberof AuthController
   */
  static async signIn(req, res) {
    const client = await pool.connect();

    try {
      const { email: emailInput, password: passwordInput } = req.body;
      const values = [emailInput];
      const { rows } = await client.query(signIn, values);

      if (!rows[0]) {
        return res.status(400)
          .json(errorResponse('Email or password incorrect!'));
      }

      const {
        id,
        firstname: firstName,
        lastname: lastName,
        email,
        password: userPassword,
        type,
        photourl,
      } = rows[0];

      const isVerified = await verifyPassword(passwordInput, userPassword);

      if (!isVerified) {
        return res.status(400)
          .json(errorResponse('Email or password incorrect!'));
      }

      const {
        id: userId,
        type: userType,
      } = rows[0];
      const token = createToken({ userId, userType });

      const signinDetails = {
        id,
        firstName,
        lastName,
        email,
        type,
        photourl,
      };

      const newSignin = { token, ...signinDetails };

      const msg = 'User successfully logged in.';
      return res
        .status(200)
        .json(successResponse(msg, [newSignin]));
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }

  /**
   * @description Verify user token
   * @static
   * @async
   *
   * @param {object} req - validate token request object
   * @param {object} res - validate token response object
   *
   * @returns
   * @memberof AuthController
   */
  static async validateToken(req, res) {
    try {
      const { token } = req.body;

      const validToken = await verifyToken(token);

      if (!validToken) {
        return res.status(401)
          .json(errorResponse('Access denied. Invalid user token.'));
      }

      return res
        .status(200)
        .json(messageResponse('Token validation successful.'));
    } catch (error) {
      const { name, message } = error;
      if (name === 'JsonWebTokenError' && message === 'invalid token') {
        return res.status(401)
          .json(errorResponse('Access denied. Invalid user token.'));
      }
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    }
  }
}

export default AuthController;
