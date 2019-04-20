import Auth from '../helpers/Auth';

const { verifyToken } = Auth;

class Authenticator {
  static async isAuth(req, res, next) {
    try {
      const requestToken = req.headers.authorization ? req.headers.authorization : req.headers['x-auth-token'];
      if (!requestToken) {
        return res.status(401).json({
          status: 401,
          error: 'You need to log in to continue.',
        });
      }
      const verifiedToken = await verifyToken(requestToken);
      if (!verifiedToken) {
        return res.status(401).json({
          status: 401,
          error: 'You need to log in to continue.',
        });
      }
      req.body.token = verifiedToken;
      return next();
    } catch (error) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized request!',
      });
    }
  }

  static async levelOne(req, res, next) {
    const { userType } = req.body.token;
    const user = userType.toString();
    const val = user === 'client';
    if (!val) {
      return res.status(401).json({
        status: 401,
        error: 'Request exclusive to client',
      });
    }
    return next();
  }

  static async levelTwo(req, res, next) {
    const { userType } = req.body.token;
    const user = userType.toString();
    const val = user === 'cashier';
    if (!val) {
      return res.status(401).json({
        status: 401,
        error: 'Request exclusive to cashier',
      });
    }
    return next();
  }

  static async levelThree(req, res, next) {
    const { userType } = req.body.token;
    const user = userType.toString();
    const val = user === 'admin';
    if (!val) {
      return res.status(401).json({
        status: 401,
        error: 'Request exclusive to admin',
      });
    }
    return next();
  }

  static async levelFour(req, res, next) {
    const { userType } = req.body.token;
    const user = userType.toString();
    const val = user === 'client' || user === 'cashier';
    if (!val) {
      return res.status(401).json({
        status: 401,
        error: 'Request exclusive to cashier or client',
        data: userType,
      });
    }
    return next();
  }

  static async levelFive(req, res, next) {
    const { userType } = req.body.token;
    const user = userType.toString();
    const val = user === 'cashier' || user === 'admin';
    if (!val) {
      return res.status(401).json({
        status: 401,
        error: 'Request exclusive to cashier or admin',
      });
    }
    return next();
  }
}

export default Authenticator;
