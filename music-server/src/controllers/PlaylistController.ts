import { Request, Response } from 'express';
import Playlist from '../models/Playlist';
import Song from '../models/Song';
import { ResponseUtil } from '../utils/response';
import logger from '../utils/logger';
import { AuthRequest } from '../middlewares/auth';

export class PlaylistController {
  /**
   * 创建歌单
   */
  async createPlaylist(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, description, isPublic } = req.body;
      const userId = req.user?.userId;

      if (!name) {
        ResponseUtil.badRequest(res, '请提供歌单名称');
        return;
      }

      const playlist = new Playlist({
        name,
        description: description || '',
        userId,
        isPublic: isPublic !== undefined ? isPublic : true,
        songs: []
      });

      await playlist.save();

      ResponseUtil.success(res, playlist, '歌单创建成功');
    } catch (error) {
      logger.error('创建歌单失败:', error);
      ResponseUtil.internalError(res, '创建歌单失败', (error as Error).message);
    }
  }

  /**
   * 获取用户歌单
   */
  async getUserPlaylists(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const playlists = await Playlist.find({ userId })
        .populate('songs', 'name artists coverUrl')
        .sort({ createdAt: -1 });

      ResponseUtil.success(res, playlists);
    } catch (error) {
      logger.error('获取歌单失败:', error);
      ResponseUtil.internalError(res, '获取歌单失败', (error as Error).message);
    }
  }

  /**
   * 获取歌单详情
   */
  async getPlaylistDetail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const playlist = await Playlist.findById(id)
        .populate('songs')
        .populate('userId', 'username nickname avatar');

      if (!playlist) {
        ResponseUtil.notFound(res, '歌单不存在');
        return;
      }

      ResponseUtil.success(res, playlist);
    } catch (error) {
      logger.error('获取歌单详情失败:', error);
      ResponseUtil.internalError(res, '获取歌单详情失败', (error as Error).message);
    }
  }

  /**
   * 添加歌曲到歌单
   */
  async addSongToPlaylist(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { playlistId, songId } = req.body;
      const userId = req.user?.userId;

      const playlist = await Playlist.findOne({ _id: playlistId, userId });
      if (!playlist) {
        ResponseUtil.notFound(res, '歌单不存在或无权限');
        return;
      }

      // 检查歌曲是否已在歌单中
      if (playlist.songs.includes(songId)) {
        ResponseUtil.badRequest(res, '歌曲已在歌单中');
        return;
      }

      playlist.songs.push(songId);
      await playlist.save();

      ResponseUtil.success(res, playlist, '添加成功');
    } catch (error) {
      logger.error('添加歌曲失败:', error);
      ResponseUtil.internalError(res, '添加歌曲失败', (error as Error).message);
    }
  }

  /**
   * 删除歌单
   */
  async deletePlaylist(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const playlist = await Playlist.findOneAndDelete({ _id: id, userId });
      if (!playlist) {
        ResponseUtil.notFound(res, '歌单不存在或无权限');
        return;
      }

      ResponseUtil.success(res, null, '歌单删除成功');
    } catch (error) {
      logger.error('删除歌单失败:', error);
      ResponseUtil.internalError(res, '删除歌单失败', (error as Error).message);
    }
  }
}

export default new PlaylistController();