import users from '../models/users';
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
    const client = await pool.connect();
    try {
      const getAllUsersQuery = `SELECT * FROM users ORDER BY id ASC`;
      const { rows } = await client.query(getAllUsersQuery);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'No user records found!',
        });
      }
      const allUsers = rows;
      return res.status(200).json({
        status: 200,
        data: allUsers,
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

export default UserController;
