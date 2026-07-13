import Playlist from '../models/Playlist';
import Song from '../models/Song';
import logger from '../utils/logger';
import { Types } from 'mongoose';

export class PlaylistService {
  /**
   * 获取公开歌单（推荐）
   */
  async getPublicPlaylists(limit: number = 10): Promise<any[]> {
    try {
      return await Playlist.find({ isPublic: true })
        .populate('userId', 'username nickname')
        .populate('songs', 'name artists coverUrl')
        .sort({ playCount: -1, createdAt: -1 })
        .limit(limit);
    } catch (error) {
      logger.error('获取公开歌单失败:', error);
      return [];
    }
  }

  /**
   * 增加歌单播放次数
   */
  async incrementPlayCount(playlistId: string): Promise<void> {
    try {
      await Playlist.findByIdAndUpdate(playlistId, {
        $inc: { playCount: 1 }
      });
    } catch (error) {
      logger.error('增加播放次数失败:', error);
    }
  }

  /**
   * 批量获取歌曲信息
   */
  async getSongsFromPlaylist(playlistId: string): Promise<any[]> {
    try {
      const playlist = await Playlist.findById(playlistId)
        .populate('songs');
      return playlist?.songs || [];
    } catch (error) {
      logger.error('获取歌单歌曲失败:', error);
      return [];
    }
  }

  /**
   * 检查歌曲是否在歌单中
   */
  async isSongInPlaylist(playlistId: string, songId: string): Promise<boolean> {
    try {
      const playlist = await Playlist.findById(playlistId);
      if (!playlist) return false;
      return playlist.songs.includes(new Types.ObjectId(songId));
    } catch (error) {
      logger.error('检查歌曲失败:', error);
      return false;
    }
  }
}

export default new PlaylistService();