import users from '../models/userModel';
import auth from '../helpers/auth';
import Passcode from '../helpers/Passcode';

const { createToken } = auth;
const { encryptPassword } = Passcode;
const allUsers = users;
const userCount = allUsers.length;

class UserController {
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
}

export default UserController;
