const jwt = require('jsonwebtoken');
import config from '../config';

class AuthService {
  generateToken(payload: any): string {
    return jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, config.jwtSecret);
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();