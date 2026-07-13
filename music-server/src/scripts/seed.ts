import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../config';
import logger from '../utils/logger';
import User from '../models/User';
import Song from '../models/Song';
import Playlist from '../models/Playlist';

interface SeedData {
  users: any[];
  songs: any[];
  playlists: any[];
}

const seedData: SeedData = {
  users: [
    {
      username: 'admin',
      email: 'admin@music.com',
      password: 'admin123',
      nickname: '管理员'
    },
    {
      username: 'testuser',
      email: 'test@music.com',
      password: 'test123',
      nickname: '测试用户'
    }
  ],
  songs: [
    {
      songId: 186016,
      name: '夜曲',
      artists: ['周杰伦'],
      album: '十一月的萧邦',
      albumId: 10492,
      coverUrl: 'https://p1.music.126.net/6Y9V8kVu1Fh7F8A9h9V9V9.jpg',
      duration: 228000
    },
    {
      songId: 186015,
      name: '稻香',
      artists: ['周杰伦'],
      album: '魔杰座',
      albumId: 10491,
      coverUrl: 'https://p1.music.126.net/5Y8V8kVu1Fh7F8A9h9V9V8.jpg',
      duration: 223000
    }
  ],
  playlists: [
    {
      name: '我喜欢的歌',
      description: '收藏的经典歌曲',
      isPublic: true
    }
  ]
};

/**
 * 初始化数据库
 */
const seedDatabase = async (): Promise<void> => {
  try {
    // 连接数据库
    await mongoose.connect(config.mongodbUri);
    logger.info('✅ MongoDB 连接成功');

    // 清空现有数据
    await User.deleteMany({});
    await Song.deleteMany({});
    await Playlist.deleteMany({});
    logger.info('🧹 已清空现有数据');

    // 创建用户
    const createdUsers = [];
    for (const userData of seedData.users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      createdUsers.push(user);
      logger.info(`👤 用户创建成功: ${userData.username}`);
    }

    // 创建歌曲
    const createdSongs = [];
    for (const songData of seedData.songs) {
      const song = new Song(songData);
      await song.save();
      createdSongs.push(song);
      logger.info(`🎵 歌曲创建成功: ${songData.name}`);
    }

    // 创建歌单
    for (let i = 0; i < seedData.playlists.length; i++) {
      const playlistData = seedData.playlists[i];
      const user = createdUsers[i % createdUsers.length];
      
      const playlist = new Playlist({
        ...playlistData,
        userId: user._id,
        songs: createdSongs.map(s => s._id)
      });
      await playlist.save();
      logger.info(`📋 歌单创建成功: ${playlistData.name}`);
    }

    logger.info('✅ 数据初始化完成！');
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.info('📝 测试账号:');
    logger.info(`   admin / admin123`);
    logger.info(`   testuser / test123`);
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    logger.error('❌ 数据初始化失败:', error);
    process.exit(1);
  }
};

// 运行初始化
seedDatabase();