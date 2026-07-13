import { Request, Response } from 'express';
import neteaseService from '../services/NeteaseService';
import { ResponseUtil } from '../utils/response';

class MusicController {
  async getRecommendPlaylists(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const data = await neteaseService.getRecommendPlaylists(limit);
      ResponseUtil.success(res, data);
    } catch (error) {
      ResponseUtil.internalError(res, '获取推荐歌单失败', String(error));
    }
  }

  async getRecommendSongs(req: Request, res: Response): Promise<void> {
    try {
      const data = await neteaseService.getRecommendSongs();
      ResponseUtil.success(res, data);
    } catch (error) {
      ResponseUtil.internalError(res, '获取热门歌曲失败', String(error));
    }
  }

  async search(req: Request, res: Response): Promise<void> {
    try {
      const { keywords, type, limit } = req.query as any;
      
      if (!keywords) {
        ResponseUtil.badRequest(res, '请提供搜索关键词');
        return;
      }

      // 修复：只传3个参数
      const data = await neteaseService.search(
        String(keywords),
        parseInt(type) || 1,
        parseInt(limit) || 30
      );
      
      ResponseUtil.success(res, data);
    } catch (error) {
      ResponseUtil.internalError(res, '搜索失败', String(error));
    }
  }

  async getSongUrl(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query as any;
      
      if (!id) {
        ResponseUtil.badRequest(res, '请提供歌曲ID');
        return;
      }

      const data = await neteaseService.getSongUrl(parseInt(id));
      ResponseUtil.success(res, data);
    } catch (error) {
      ResponseUtil.internalError(res, '获取播放链接失败', String(error));
    }
  }

  async getSongDetail(req: Request, res: Response): Promise<void> {
    try {
      const { ids } = req.query as any;
      
      if (!ids) {
        ResponseUtil.badRequest(res, '请提供歌曲ID');
        return;
      }

      const idArray = (ids as string).split(',').map((id: string) => parseInt(id.trim()));
      const data = await neteaseService.getSongDetail(idArray);
      ResponseUtil.success(res, data);
    } catch (error) {
      ResponseUtil.internalError(res, '获取歌曲详情失败', String(error));
    }
  }

  async getLyric(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query as any;
      
      if (!id) {
        ResponseUtil.badRequest(res, '请提供歌曲ID');
        return;
      }

      const data = await neteaseService.getLyric(parseInt(id));
      ResponseUtil.success(res, data);
    } catch (error) {
      ResponseUtil.internalError(res, '获取歌词失败', String(error));
    }
  }
}

export default new MusicController();