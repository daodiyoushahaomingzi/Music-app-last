import { Request, Response } from 'express';
// 改用 require 导入 jwt
const jwt = require('jsonwebtoken');
import User from '../models/User';
import config from '../config';
import { ResponseUtil } from '../utils/response';

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        ResponseUtil.badRequest(res, '请提供用户名、邮箱和密码');
        return;
      }

      const existingUser = await User.findOne({
        $or: [{ username }, { email }]
      });

      if (existingUser) {
        ResponseUtil.badRequest(res, '用户名或邮箱已被使用');
        return;
      }

      const user = new User({ username, email, password });
      await user.save();

      const token = jwt.sign(
        { userId: user._id, username: user.username, email: user.email },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      ResponseUtil.success(res, { user, token }, '注册成功');
    } catch (error) {
      ResponseUtil.internalError(res, '注册失败', String(error));
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        ResponseUtil.badRequest(res, '请提供用户名和密码');
        return;
      }

      const user = await User.findOne({ username });
      if (!user) {
        ResponseUtil.badRequest(res, '用户名或密码错误');
        return;
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        ResponseUtil.badRequest(res, '用户名或密码错误');
        return;
      }

      const token = jwt.sign(
        { userId: user._id, username: user.username, email: user.email },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      ResponseUtil.success(res, { user, token }, '登录成功');
    } catch (error) {
      ResponseUtil.internalError(res, '登录失败', String(error));
    }
  }
}

export default new AuthController();