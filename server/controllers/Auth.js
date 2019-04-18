import pool from '../database/db';

import users from '../models/users';
import Auth from '../helpers/Auth';
import Passcode from '../helpers/Passcode';

const { createToken } = Auth;
const { encryptPassword } = Passcode;
const allUsers = users;

class AuthController {
  static async signUp(req, res) {
    const client = await pool.connect();
    try {
      const {
        firstName, lastName, email, password: stringPassword, type: userInputType, isAdmin,
      } = req.body;
      const securePassword = await encryptPassword(stringPassword);

      const addUserQuery = `INSERT INTO users (firstName, lastName, email, password, type, isAdmin)
                    VALUES($1, $2, $3, $4, $5, $6)
                    RETURNING id, firstName, lastName, email`;
      const values = [firstName, lastName, email, securePassword, userInputType, isAdmin];
      const { rows } = await client.query(addUserQuery, values);
      if (rows[0]) {
        const newUser = rows[0];
        const { id: userId, type: userType } = newUser;
        const token = createToken({ userId, userType });
        const {
          password, isadmin, type, ...signupDetails
        } = newUser;
        const newSignup = { token, ...signupDetails };
        return res.header('x-auth-token', token).status(201).json({
          status: 201,
          data: newSignup,
        });
      }
    } catch (error) {
      const { constraint } = error;
      if (constraint === 'users_email_key') {
        return res.status(409).json({
          status: 409,
          error: 'Email linked to existing user!',
        });
      }
      return res.status(500).json({
        status: 500,
        error: 'Internal server error!',
      });
    } finally {
      await client.release();
    }
  }

  static async signIn(req, res) {
    const { email } = req.body;
    const singleUser = allUsers.find((user) => { return user.email === email; });
    const { id: userId, type: userType } = singleUser;
    const token = createToken({ userId, userType });
    const {
      password, isAdmin, type, ...signinDetails
    } = singleUser;
    const newSignin = { token, ...signinDetails };
    return res.header('x-auth-token', token).status(200).json({
      status: 200,
      data: newSignin,
    });
  }
}

export default AuthController;
