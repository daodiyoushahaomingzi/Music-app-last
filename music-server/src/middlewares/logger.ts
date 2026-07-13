import fs from 'fs';
import path from 'path';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private logDir: string;
  private logFile: string;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.logFile = path.join(this.logDir, 'app.log');
    this.ensureLogDirectory();
  }

  /**
   * 确保日志目录存在
   */
  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * 获取当前时间戳
   */
  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString();
  }

  /**
   * 获取日志级别对应的颜色代码（终端输出）
   */
  private getColorCode(level: LogLevel): string {
    const colors = {
      info: '\x1b[36m',   // 青色
      warn: '\x1b[33m',   // 黄色
      error: '\x1b[31m',  // 红色
      debug: '\x1b[35m'   // 紫色
    };
    return colors[level] || '\x1b[0m';
  }

  /**
   * 重置颜色
   */
  private resetColor(): string {
    return '\x1b[0m';
  }

  /**
   * 写入日志文件
   */
  private writeToFile(logMessage: string): void {
    try {
      fs.appendFileSync(this.logFile, logMessage + '\n');
    } catch (error) {
      // 如果写入文件失败，输出到控制台
      console.error('写入日志文件失败:', error);
    }
  }

  /**
   * 核心日志方法
   */
  private log(level: LogLevel, message: string, ...args: any[]): void {
    const timestamp = this.getTimestamp();
    const levelUpper = level.toUpperCase();
    const color = this.getColorCode(level);
    const reset = this.resetColor();

    // 构建日志消息
    let logMessage = `[${timestamp}] [${levelUpper}] ${message}`;
    
    // 如果有额外参数，添加到日志中
    if (args.length > 0) {
      const argsStr = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');
      logMessage += ` ${argsStr}`;
    }

    // 控制台输出（带颜色）
    console.log(`${color}${logMessage}${reset}`);

    // 文件输出（不带颜色）
    const fileLogMessage = `[${timestamp}] [${levelUpper}] ${message} ${
      args.length > 0 ? args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') : ''
    }`;
    this.writeToFile(fileLogMessage);
  }

  /**
   * 信息级别日志
   */
  info(message: string, ...args: any[]): void {
    this.log('info', message, ...args);
  }

  /**
   * 警告级别日志
   */
  warn(message: string, ...args: any[]): void {
    this.log('warn', message, ...args);
  }

  /**
   * 错误级别日志
   */
  error(message: string, ...args: any[]): void {
    this.log('error', message, ...args);
  }

  /**
   * 调试级别日志（只在开发环境输出）
   */
  debug(message: string, ...args: any[]): void {
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      this.log('debug', message, ...args);
    }
  }

  /**
   * HTTP 请求日志
   */
  http(req: any, statusCode: number, duration: number): void {
    const method = req.method || 'UNKNOWN';
    const path = req.path || req.url || '/';
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    
    this.info(`HTTP ${method} ${path} - ${statusCode} - ${duration}ms - ${ip}`);
  }

  /**
   * 数据库操作日志
   */
  db(operation: string, collection: string, details?: any): void {
    this.debug(`DB ${operation} ${collection}`, details || '');
  }

  /**
   * API 调用日志
   */
  api(service: string, endpoint: string, status: number, duration: number): void {
    this.info(`API ${service} ${endpoint} - ${status} - ${duration}ms`);
  }
}

export default new Logger();