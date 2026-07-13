import { Response } from 'express';

// 在本地定义类型，不依赖外部 types
interface ApiResponse<T = any> {
  code: number;
  data: T;
  message?: string;
}

interface ErrorResponse {
  code: number;
  message: string;
  error?: string;
}

export class ResponseUtil {
  static success<T>(res: Response, data: T, message?: string): void {
    const response: ApiResponse<T> = {
      code: 200,
      data,
      message: message || 'success'
    };
    res.status(200).json(response);
  }

  static error(res: Response, message: string, code: number = 500, error?: string): void {
    const response: ErrorResponse = {
      code,
      message,
      error
    };
    res.status(code).json(response);
  }

  static badRequest(res: Response, message: string = '请求参数错误'): void {
    this.error(res, message, 400);
  }

  static unauthorized(res: Response, message: string = '未授权'): void {
    this.error(res, message, 401);
  }

  static notFound(res: Response, message: string = '资源不存在'): void {
    this.error(res, message, 404);
  }

  static internalError(res: Response, message: string = '服务器内部错误', error?: string): void {
    this.error(res, message, 500, error);
  }
}