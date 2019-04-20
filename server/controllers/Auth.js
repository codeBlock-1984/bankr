import pool from '../database/db';
import Auth from '../helpers/Auth';
import Passcode from '../helpers/Passcode';

const { createToken } = Auth;
const { encryptPassword, verifyPassword } = Passcode;
const userRoles = [true, false];

class AuthController {
  static async signUp(req, res) {
    const client = await pool.connect();
    try {
      const {
        firstName, lastName, email, password: stringPassword, type: userInputType,
      } = req.body;
      const securePassword = await encryptPassword(stringPassword);
      const role = userInputType.toString();
      const isAdmin = (role === 'cashier' || role === 'admin') ? userRoles[0] : userRoles[1];

      const addUserQuery = `INSERT INTO users (firstName, lastName, email, password, type, isAdmin)
                    VALUES($1, $2, $3, $4, $5, $6)
                    RETURNING id, firstName, lastName, email, type`;
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
          data: [newSignup],
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
    const client = await pool.connect();
    try {
      const { email, password } = req.body;
      const signInQuery = `SELECT * FROM users WHERE email = $1`;
      const values = [email];
      const { rows } = await client.query(signInQuery, values);
      if (!rows[0]) {
        return res.status(400).json({
          status: 400,
          error: 'Email or password incorrect!',
        });
      }
      const singleUser = rows[0];
      const { password: singleUserPassword } = singleUser;
      const isVerified = await verifyPassword(password, singleUserPassword);
      if (!isVerified) {
        return res.status(400).json({
          status: 400,
          error: 'Email or password incorrect!',
        });
      }
      const { id: userId, type: userType } = singleUser;
      const token = createToken({ userId, userType });
      const {
        password: userPassword, isadmin, type, createdon, updatedon, ...signinDetails
      } = singleUser;
      const newSignin = { token, ...signinDetails };
      return res.header('x-auth-token', token).status(200).json({
        status: 200,
        data: [newSignin],
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Internal server error!',
      });
    } finally {
      await client.release();
    }
  }
}

export default AuthController;
