import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response';
import logger from '../utils/logger';

export class ErrorHandler {
  static handle(err: any, req: Request, res: Response, next: NextFunction): void {
    logger.error('服务器错误:', err);

    // Mongoose 验证错误
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      ResponseUtil.badRequest(res, messages.join(', '));
      return;
    }

    // Mongoose 重复键错误
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      ResponseUtil.badRequest(res, `${field} 已存在`);
      return;
    }

    // JWT 错误
    if (err.name === 'JsonWebTokenError') {
      ResponseUtil.unauthorized(res, '无效的 Token');
      return;
    }

    if (err.name === 'TokenExpiredError') {
      ResponseUtil.unauthorized(res, 'Token 已过期');
      return;
    }

    // Axios 超时错误
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      ResponseUtil.error(res, '请求超时，请稍后重试', 504);
      return;
    }

    // JSON 解析错误
    if (err instanceof SyntaxError && 'body' in err) {
      ResponseUtil.badRequest(res, '无效的 JSON 格式');
      return;
    }

    // 默认错误
    ResponseUtil.internalError(res, '服务器内部错误', err.message);
  }
}

export default ErrorHandler;