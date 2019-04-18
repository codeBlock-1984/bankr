import pool from '../database/db';

class UserController {
  static async getUser(req, res) {
    const client = await pool.connect();
    try {
      const { userId } = req.params;
      const getUserQuery = `SELECT * FROM users WHERE id = $1`;
      const values = [userId];
      const { rows } = await client.query(getUserQuery, values);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'User with given id not found!',
        });
      }
      const singleUser = rows[0];
      return res.status(200).json({
        status: 200,
        data: singleUser,
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
