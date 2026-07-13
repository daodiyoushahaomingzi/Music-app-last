import { Response } from 'express';
import User, { IUser } from '../models/User';
import { ResponseUtil } from '../utils/response';
import { AuthRequest } from '../middlewares/auth';

class UserController {
  async getUserInfo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        ResponseUtil.unauthorized(res, '请先登录');
        return;
      }

      const user = await User.findById(userId).select('-password -__v') as IUser | null;

      if (!user) {
        ResponseUtil.notFound(res, '用户不存在');
        return;
      }

      ResponseUtil.success(res, {
        id: user._id,
        username: user.username,
        email: user.email,
        nickname: user.nickname || '',
        avatar: user.avatar || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }, '获取用户信息成功');
    } catch (error) {
      ResponseUtil.internalError(res, '获取用户信息失败', String(error));
    }
  }

  async updateUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { nickname, avatar } = req.body;

      if (!userId) {
        ResponseUtil.unauthorized(res, '请先登录');
        return;
      }

      const updateData: any = {};
      if (nickname !== undefined) updateData.nickname = nickname;
      if (avatar !== undefined) updateData.avatar = avatar;

      if (Object.keys(updateData).length === 0) {
        ResponseUtil.badRequest(res, '请提供要更新的字段');
        return;
      }

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, select: '-password -__v' }
      ) as IUser | null;

      if (!user) {
        ResponseUtil.notFound(res, '用户不存在');
        return;
      }

      ResponseUtil.success(res, {
        id: user._id,
        username: user.username,
        email: user.email,
        nickname: user.nickname || '',
        avatar: user.avatar || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }, '更新成功');
    } catch (error) {
      ResponseUtil.internalError(res, '更新用户信息失败', String(error));
    }
  }

  async changePassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { oldPassword, newPassword } = req.body;

      if (!userId) {
        ResponseUtil.unauthorized(res, '请先登录');
        return;
      }

      if (!oldPassword || !newPassword) {
        ResponseUtil.badRequest(res, '请提供旧密码和新密码');
        return;
      }

      if (newPassword.length < 6) {
        ResponseUtil.badRequest(res, '新密码长度不能少于6个字符');
        return;
      }

      const user = await User.findById(userId) as IUser | null;
      if (!user) {
        ResponseUtil.notFound(res, '用户不存在');
        return;
      }

      const isPasswordValid = await user.comparePassword(oldPassword);
      if (!isPasswordValid) {
        ResponseUtil.badRequest(res, '旧密码错误');
        return;
      }

      user.password = newPassword;
      await user.save();

      ResponseUtil.success(res, null, '密码修改成功');
    } catch (error) {
      ResponseUtil.internalError(res, '修改密码失败', String(error));
    }
  }
}

export default new UserController();