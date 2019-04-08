import users from '../models/userModel';
import Auth from '../helpers/Auth';
import Passcode from '../helpers/Passcode';

const { createToken } = Auth;
const { encryptPassword } = Passcode;
const allUsers = users;
const userCount = allUsers.length;

class AuthController {
  static async signUp(req, res) {
    const newUser = req.body;
    newUser.id = userCount + 1;
    newUser.password = await encryptPassword(newUser.password);
    newUser.type = newUser.type || 'client';
    newUser.isAdmin = newUser.isAdmin || false;
    const { id: userId, type: userType } = newUser;
    const token = createToken({ userId, userType });
    allUsers.push(newUser);
    const {
      // eslint-disable-next-line
      password, isAdmin, type, ...signupDetails
    } = newUser;
    const newSignup = { token, ...signupDetails };
    return res.header('x-auth-token', token).status(201).json({
      status: 201,
      data: newSignup,
    });
  }

  static async signIn(req, res) {
    const { email } = req.body;
    const singleUser = allUsers.find((user) => { return user.email === email; });
    const { id: userId, type: userType } = singleUser;
    const token = createToken({ userId, userType });
    const {
      // eslint-disable-next-line
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
