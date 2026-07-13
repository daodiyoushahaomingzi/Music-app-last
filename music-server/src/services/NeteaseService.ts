import axios from 'axios';
import config from '../config';

class NeteaseService {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: config.neteaseApi,
      timeout: 30000
    });
  }

  async getRecommendPlaylists(limit: number = 10): Promise<any> {
    try {
      const response = await this.client.get('/top/playlist', {
        params: { limit }
      });
      return response.data.playlists || [];
    } catch (error) {
      console.error('获取推荐歌单失败:', error);
      throw error;
    }
  }

  async getRecommendSongs(): Promise<any> {
    try {
      const response = await this.client.get('/top/song', {
        params: { type: 0 }
      });
      // 修复：返回数组而不是对象
      return response.data.data || [];
    } catch (error) {
      console.error('获取热门歌曲失败:', error);
      throw error;
    }
  }

  async search(keywords: string, type: number = 1, limit: number = 30): Promise<any> {
    try {
      const response = await this.client.get('/search', {
        params: { keywords, type, limit }
      });
      return response.data.result || { songs: [] };
    } catch (error) {
      console.error('搜索失败:', error);
      throw error;
    }
  }

  async getSongUrl(id: number): Promise<any> {
    try {
      const response = await this.client.get('/song/url', {
        params: { id }
      });
      const data = response.data.data || [];
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('获取播放链接失败:', error);
      throw error;
    }
  }

  async getSongDetail(ids: number[]): Promise<any> {
    try {
      const response = await this.client.get('/song/detail', {
        params: { ids: ids.join(',') }
      });
      const songs = response.data.songs || [];
      return songs.length > 0 ? songs[0] : null;
    } catch (error) {
      console.error('获取歌曲详情失败:', error);
      throw error;
    }
  }

  async getLyric(id: number): Promise<any> {
    try {
      const response = await this.client.get('/lyric', {
        params: { id }
      });
      return response.data;
    } catch (error) {
      console.error('获取歌词失败:', error);
      throw error;
    }
  }
}

export default new NeteaseService();