import users from '../models/userModel';
import Auth from '../helpers/Auth';
import Passcode from '../helpers/Passcode';

const { createToken } = Auth;
const { encryptPassword } = Passcode;
const allUsers = [...users];
const userCount = allUsers.length;

class AuthController {
  static async signUp(req, res) {
    const newUser = req.body;
    newUser.id = userCount + 1;
    newUser.password = await encryptPassword(newUser.password);
    newUser.type = newUser.type || 'client';
    newUser.isAdmin = newUser.isAdmin || false;
    const { id, type } = newUser;
    const token = createToken({ id, type });
    allUsers.push(newUser);
    const newSignup = { token, ...newUser };
    return res.header('x-auth-token', token).status(201).json({
      status: 201,
      data: newSignup,
    });
  }

  static async signIn(req, res) {
    const { email } = req.body;
    const singleUser = allUsers.find((user) => { return user.email === email; });
    const { id, type } = singleUser;
    const token = createToken({ id, type });
    const newSignin = { token, ...singleUser };
    return res.header('x-auth-token', token).status(200).json({
      status: 200,
      data: newSignin,
    });
  }
}

export default AuthController;
