import users from '../models/users';
import Auth from '../helpers/Auth';
import Passcode from '../helpers/Passcode';

const { createToken } = Auth;
const { encryptPassword, verifyPassword } = Passcode;
const allUsers = users;
const userCount = allUsers.length;

class AuthController {
  static async signUp(req, res) {
    try {
      const newUser = req.body;
      newUser.id = userCount + 1;
      newUser.password = await encryptPassword(newUser.password);
      newUser.type = newUser.type;
      newUser.isAdmin = newUser.isAdmin || false;
      const { id: userId, type: userType } = newUser;
      const token = createToken({ userId, userType });
      allUsers.push(newUser);
      const {
        password, isAdmin, type, ...signupDetails
      } = newUser;
      const newSignup = { token, ...signupDetails };
      return res.header('x-auth-token', token).status(201).json({
        status: 201,
        data: newSignup,
      });
    } catch (error) {
      console.log(error);
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
        data: newSignin,
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
