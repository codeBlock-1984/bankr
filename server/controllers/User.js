import pool from '../database/db';
import Responder from '../helpers/Responder';
import userQuery from '../database/queries/user';

const { successResponse, errorResponse } = Responder;
const { getUser, getAllUsers } = userQuery;

class UserController {
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

      const singleUser = rows[0];

      return res.status(200)
        .json(successResponse([singleUser]));
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }

  static async getAllUsers(req, res) {
    const client = await pool.connect();

    try {
      const { rows } = await client.query(getAllUsers);

      if (!rows[0]) {
        return res.status(404)
          .json(errorResponse('No user records found!'));
      }

      const allUsers = rows;

      return res.status(200)
        .json(successResponse(allUsers));
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }
}

export default UserController;
