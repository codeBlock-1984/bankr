import pool from '../database/db';
import Responder from '../helpers/Responder';
import userQuery from '../database/queries/user';
import Auth from '../helpers/Auth';
import PasswordAuth from '../helpers/PasswordAuth';
import authQuery from '../database/queries/auth';
import actionQuery from '../database/queries/action';

const { successResponse, errorResponse, messageResponse } = Responder;
const {
  getUser,
  getUserEmail,
  getAllUsers,
  deleteUser,
  getPassword,
  updatePassword,
  updatePhoto,
} = userQuery;
const { createToken, verifyToken } = Auth;
const { encryptPassword, verifyPassword } = PasswordAuth;
const { addUser, signIn } = authQuery;
const { addAction } = actionQuery;

/**
 * @description Defines all actions that can be performed on the user resource
 *
 * @class UserController
 */
class UserController {
  /**
   * @description Creates a new cashier or admin user account
   * @static
   * @async
   *
   * @param {object} req - create new user request object
   * @param {object} res - create new user response object
   *
   * @returns
   * @memberof UserController
   */
  static async createUser(req, res) {
    const client = await pool.connect();

    try {
      const adminToken = req.headers['x-auth-token'];
      const { userId: admin } = await verifyToken(adminToken);

      const {
        firstName: firstNameInput,
        lastName: lastNameInput,
        email: emailInput,
        type: userRole,
      } = req.body;

      const checkValue = [emailInput];

      const {
        rows: checkExistingRows,
      } = await client.query(signIn, checkValue);

      if (checkExistingRows[0]) {
        return res.status(409)
          .json(errorResponse('Email linked to existing user!'));
      }

      const userPassword = 'user123';
      const securePassword = await encryptPassword(userPassword);
      const isAdmin = true;

      const values = [
        firstNameInput,
        lastNameInput,
        emailInput,
        securePassword,
        userRole,
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
        } = rows[0];

        const {
          id: userId,
          type: userType,
        } = rows[0];
        const token = createToken({ userId, userType });

        const actionType = 'created user';
        const addActionValues = [
          firstName, lastName, type, actionType, email, admin
        ];

        await client.query(addAction, addActionValues);


        const signupDetails = {
          id,
          firstName,
          lastName,
          email,
          type,
          userPassword,
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
   * @description Gets a user
   * @static
   * @async
   *
   * @param {object} req - get user request object
   * @param {object} res - get user response object
   *
   * @returns
   * @memberof UserController
   */
  static async getUser(req, res) {
    const client = await pool.connect();

    try {
      const { userId } = req.params;
      const values = [userId];
      const { rows } = await client.query(getUser, values);

      if (!rows[0]) {
        return res.status(404)
          .json(errorResponse('User with specified id not found!'));
      }

      const {
        id,
        firstname: firstName,
        lastname: lastName,
        email,
        type,
        isadmin: isAdmin,
        createdon: createdOn,
      } = rows[0];

      const singleUser = {
        id,
        firstName,
        lastName,
        email,
        type,
        isAdmin,
        createdOn,
      };

      const msg = 'Successfully retrieved one user account.';

      return res.status(200)
        .json(successResponse(msg, [singleUser]));
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }

  /**
   * @description Gets all users
   * @static
   * @async
   *
   * @param {object} req - get users request object
   * @param {object} res - get users response object
   *
   * @returns
   * @memberof UserController
   */
  static async getAllUsers(req, res) {
    const client = await pool.connect();

    try {
      const { rows } = await client.query(getAllUsers);

      if (!rows[0]) {
        return res.status(404)
          .json(errorResponse('No user records found!'));
      }

      const allUsers = rows;

      const msg = 'Successfully retrieved all user records.';
      return res.status(200)
        .json(successResponse(msg, allUsers));
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }

  /**
   * @description Deletes a user
   * @static
   * @async
   *
   * @param {object} req - delete user request object
   * @param {object} res - delete user response object
   *
   * @returns
   * @memberof UserController
   */
  static async deleteUser(req, res) {
    const client = await pool.connect();

    try {
      const adminToken = req.headers['x-auth-token'];
      const { userId: admin } = await verifyToken(adminToken);

      const { email } = req.params;
      const values = [email];

      const { rows } = await client.query(getUserEmail, values);

      if (!rows[0]) {
        return res.status(404)
          .json(errorResponse('User with specified email not found!'));
      }

      const {
        firstname: firstName,
        lastname: lastName,
        type,
      } = rows[0];

      const { rows: deleteRows } = await client.query(deleteUser, values);

      const {
        id,
      } = deleteRows[0];

      const actionType = 'deleted user';
      const addActionValues = [
        firstName, lastName, type, actionType, email, admin
      ];

      await client.query(addAction, addActionValues);

      const msg = `User with id ${id} successfully deleted.`;

      return res.status(200)
        .json(messageResponse(msg));
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }

  /**
   * @description Updates a user's password
   * @static
   * @async
   *
   * @param {object} req - Update user password request object
   * @param {object} res - Update user password response object
   *
   * @returns
   * @memberof UserController
   */
  static async updatePassword(req, res) {
    const client = await pool.connect();
    try {
      const userToken = req.headers['x-auth-token'];
      const { userId: user } = await verifyToken(userToken);
      const { newPassword, oldPassword } = req.body;

      const getValue = [user];
      const { rows: getRows } = await client.query(getPassword, getValue);

      const {
        password: userPassword,
      } = getRows[0];

      const isVerified = await verifyPassword(oldPassword, userPassword);

      if (!isVerified) {
        return res.status(400)
          .json(errorResponse('Password is incorrect!'));
      }

      const hashedNewPassword = await encryptPassword(newPassword);
      const values = [hashedNewPassword, user];
      const { rows } = await client.query(updatePassword, values);

      if (!rows[0]) {
        const error = 'Internal server error!';
        return res.status(500)
          .json(errorResponse(error));
      }

      const msg = `Password successfully changed.`;
      return res.status(200)
        .json(messageResponse(msg));
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }

  /**
   * @description Updates a user's photo url
   * @static
   * @async
   *
   * @param {object} req - Update photo url request object
   * @param {object} res - Update photo url response object
   *
   * @returns
   * @memberof UserController
   */
  static async updatePhoto(req, res) {
    const client = await pool.connect();
    try {
      const userToken = req.headers['x-auth-token'];
      const { userId: user } = await verifyToken(userToken);
      const { photoUrl } = req.body;

      const values = [photoUrl, user];
      const { rows } = await client.query(updatePhoto, values);

      if (!rows[0]) {
        const error = 'Internal server error!';
        return res.status(500)
          .json(errorResponse(error));
      }

      const msg = `Photo upload successful.`;
      return res.status(200)
        .json(messageResponse(msg));
    } catch (error) {
      console.log(error);
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }
}

export default UserController;
