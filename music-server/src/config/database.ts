import mongoose from 'mongoose';
import config from './index';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('✅ MongoDB 连接成功');
    return true;
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error);
    return false;
  }
};

// 获取连接状态
const getConnectionStatus = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export { connectDB, getConnectionStatus };
export default connectDB;