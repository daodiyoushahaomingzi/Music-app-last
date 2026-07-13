import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { ResponseUtil } from '../utils/response';
import { JWTPayload } from '../types';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      ResponseUtil.unauthorized(res, '请先登录');
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      ResponseUtil.unauthorized(res, 'Token 已过期');
    } else if (error instanceof jwt.JsonWebTokenError) {
      ResponseUtil.unauthorized(res, '无效的 Token');
    } else {
      ResponseUtil.unauthorized(res, '认证失败');
    }
  }
};