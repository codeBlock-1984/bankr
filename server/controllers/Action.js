import pool from '../database/db';
import actionQuery from '../database/queries/action';
import Responder from '../helpers/Responder';
import Auth from '../helpers/Auth';

const { getActionAdmin } = actionQuery;
const { verifyToken } = Auth;
const { successResponse, errorResponse } = Responder;

/**
 * @description Defines actions that can be
 * performed on the action resource
 *
 * @class ActionController
 */
class ActionController {
  /**
   * @description Gets actions performed by a specific admin
   * @static
   * @async
   *
   * @param {object} req - get actions by admin request object
   * @param {object} res - get actions by admin response object
   * @returns
   * @memberof ActionController
   */
  static async getActionsAdmin(req, res) {
    const client = await pool.connect();

    try {
      const token = req.headers['x-auth-token'];
      const { userId: loggedInAdmin } = await verifyToken(token);

      const values = [loggedInAdmin];
      const { rows } = await client.query(getActionAdmin, values);

      if (!rows[0]) {
        const error = `No action records found for
                       admin with id ${loggedInAdmin}!`;

        return res.status(404)
          .json(errorResponse(error));
      }

      const adminActions = rows;

      const msg = 'Successfully retrieved admin actions.';
      return res.status(200)
        .json(successResponse(msg, [adminActions]));
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }
}

export default ActionController;
