import users from '../models/userModel';
import ArraySorter from '../helpers/ArraySorter';

const { arrayFinder } = ArraySorter;
const allUsers = users;

class UserController {
  static async getUser(req, res) {
    const userId = parseInt(req.params.userId, 10);
    const singleUser = arrayFinder(allUsers, 'id', userId);
    return res.status(200).json({
      status: 200,
      data: singleUser,
    });
  }

  static async getAllUsers(req, res) {
    return res.status(200).json({
      status: 200,
      data: allUsers,
    });
  }
}

export default UserController;
