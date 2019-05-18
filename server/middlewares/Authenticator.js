import Auth from '../helpers/Auth';

const { verifyToken } = Auth;

class Authenticator {
  static async isAuth(req, res, next) {
    try {
      const requestToken = req.headers['x-auth-token'];
      if (!requestToken) {
        return res.status(401).json({
          status: 401,
          error: 'Access denied. Unauthorized request.',
        });
      }
      const verifiedToken = await verifyToken(requestToken);
      if (!verifiedToken) {
        return res.status(401).json({
          status: 401,
          error: 'Access denied. Unauthorized request.',
        });
      }
      req.body.token = verifiedToken;
      return next();
    } catch (error) {
      return res.status(401).json({
        status: 401,
        error: 'Access denied. Unauthorized request.',
      });
    }
  }

  static async isUser(req, res, next) {
    const { userType } = req.body.token;
    const user = userType.toString();
    const val = user === 'client';
    if (!val) {
      return res.status(403).json({
        status: 403,
        error: 'Forbidden. Issuer not permitted.',
      });
    }
    return next();
  }

  static async isCashier(req, res, next) {
    const { userType } = req.body.token;
    const user = userType.toString();
    const val = user === 'cashier';
    if (!val) {
      return res.status(403).json({
        status: 403,
        error: 'Forbidden. Issuer not permitted.',
      });
    }
    return next();
  }

  static async isAdmin(req, res, next) {
    const { userType } = req.body.token;
    const user = userType.toString();
    const val = user === 'cashier' || user === 'admin';
    if (!val) {
      return res.status(403).json({
        status: 403,
        error: 'Forbidden. Issuer not permitted.',
      });
    }
    return next();
  }

  static async isSuper(req, res, next) {
    const { userType } = req.body.token;
    const user = userType.toString();
    const val = user === 'admin';
    if (!val) {
      return res.status(403).json({
        status: 403,
        error: 'Forbidden. Issuer not permitted.',
      });
    }
    return next();
  }
}

export default Authenticator;
