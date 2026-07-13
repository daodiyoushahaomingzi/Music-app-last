import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  neteaseApi: string;
  corsOrigin: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/music_app',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  neteaseApi: process.env.NETEASE_API || 'https://api.quanquan.space',
  corsOrigin: process.env.CORS_ORIGIN || '*'
};

export default config;